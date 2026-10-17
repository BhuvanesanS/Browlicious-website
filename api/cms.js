const crypto = require('node:crypto');
const { get, put } = require('@vercel/blob');

const DATABASE_PATH = 'browlicious-cms/posts.json';
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const SAFE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function send(res, status, data) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function normalizeIp(value) {
  const ip = String(value || '').trim();
  // Some platforms represent an IPv4 address as an IPv6-mapped address.
  // Treat both forms as the same approved network address.
  return ip.replace(/^::ffff:/i, '');
}

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '');
  return normalizeIp(forwarded.split(',')[0] || req.socket?.remoteAddress || 'unknown');
}

function canManage(req) {
  const allowed = String(process.env.CMS_ALLOWED_IPS || '')
    .split(',')
    .map(normalizeIp)
    .filter(Boolean);
  return allowed.includes(clientIp(req));
}

function requireManager(req, res) {
  if (canManage(req)) return true;
  send(res, 403, { error: 'This publishing portal is restricted to approved network addresses.', yourIp: clientIp(req) });
  return false;
}

async function streamToText(stream) {
  let text = '';
  for await (const chunk of stream) text += Buffer.from(chunk).toString('utf8');
  return text;
}

async function readDatabase() {
  const result = await get(DATABASE_PATH, { access: 'private', useCache: false });
  if (!result) return { posts: [] };
  try {
    const parsed = JSON.parse(await streamToText(result.stream));
    return { posts: Array.isArray(parsed.posts) ? parsed.posts : [] };
  } catch {
    return { posts: [] };
  }
}

async function writeDatabase(data) {
  await put(DATABASE_PATH, JSON.stringify(data, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 0,
  });
}

function cleanText(value, limit) {
  return String(value || '').trim().slice(0, limit);
}

function slugify(value) {
  return cleanText(value, 160).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 110);
}

function preparePost(input, existing = {}) {
  const title = cleanText(input.title, 160);
  const slug = slugify(input.slug || title);
  if (!title || !slug) throw new Error('Please provide an article title and URL slug.');
  const status = input.status === 'published' ? 'published' : 'draft';
  const now = new Date().toISOString();
  return {
    ...existing,
    title,
    slug,
    excerpt: cleanText(input.excerpt, 320),
    body: cleanText(input.body, 30000),
    coverImage: cleanText(input.coverImage, 300),
    coverAlt: cleanText(input.coverAlt, 180),
    seoTitle: cleanText(input.seoTitle, 180) || title,
    seoDescription: cleanText(input.seoDescription, 320),
    author: cleanText(input.author, 80) || 'Browlicious team',
    status,
    publishedAt: status === 'published' ? (existing.publishedAt || now) : null,
    updatedAt: now,
  };
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 6 * 1024 * 1024) throw new Error('Request is too large.');
  }
  try { return raw ? JSON.parse(raw) : {}; } catch { throw new Error('Please submit valid data.'); }
}

function visiblePost(post) {
  const { deletedAt, ...safe } = post;
  return safe;
}

async function serveMedia(req, res, pathname) {
  if (!pathname.startsWith('browlicious-cms/media/')) return send(res, 404, { error: 'Image not found.' });
  const result = await get(pathname, { access: 'private' });
  if (!result) return send(res, 404, { error: 'Image not found.' });
  res.status(200);
  res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  for await (const chunk of result.stream) res.write(chunk);
  res.end();
}

module.exports = async function handler(req, res) {
  try {
    const action = String(req.query?.action || 'posts');
    if (action === 'status') return send(res, 200, { allowed: canManage(req), yourIp: clientIp(req) });
    if (action === 'media' && req.method === 'GET') return serveMedia(req, res, String(req.query?.pathname || ''));

    if (req.method === 'GET' && action === 'posts') {
      const database = await readDatabase();
      const posts = database.posts.filter((post) => !post.deletedAt && post.status === 'published')
        .sort((a, b) => new Date(b.publishedAt || b.updatedAt) - new Date(a.publishedAt || a.updatedAt))
        .map(visiblePost);
      return send(res, 200, { posts });
    }
    if (req.method === 'GET' && action === 'post') {
      const slug = slugify(req.query?.slug || '');
      const database = await readDatabase();
      const post = database.posts.find((item) => !item.deletedAt && item.status === 'published' && item.slug === slug);
      return post ? send(res, 200, { post: visiblePost(post) }) : send(res, 404, { error: 'Article not found.' });
    }

    if (!requireManager(req, res)) return;
    const database = await readDatabase();

    if (req.method === 'GET' && action === 'manage-posts') {
      return send(res, 200, { posts: database.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) });
    }
    if (req.method === 'POST' && action === 'media') {
      const input = await readBody(req);
      const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(input.dataUrl || ''));
      if (!match) return send(res, 400, { error: 'Please use a PNG, JPEG or WebP image.' });
      const buffer = Buffer.from(match[2], 'base64');
      if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) return send(res, 400, { error: 'Image must be smaller than 4 MB.' });
      const type = match[1];
      if (!SAFE_IMAGE_TYPES.has(type)) return send(res, 400, { error: 'Unsupported image type.' });
      const extension = type === 'image/jpeg' ? 'jpg' : type.split('/')[1];
      const pathname = `browlicious-cms/media/${crypto.randomUUID()}.${extension}`;
      await put(pathname, buffer, { access: 'private', addRandomSuffix: false, contentType: type, cacheControlMaxAge: 31536000 });
      return send(res, 201, { url: `/api/cms?action=media&pathname=${encodeURIComponent(pathname)}`, pathname });
    }
    if (req.method === 'POST' && action === 'post') {
      const input = await readBody(req);
      const post = preparePost(input, { id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      if (database.posts.some((item) => item.slug === post.slug && !item.deletedAt)) return send(res, 409, { error: 'That URL slug is already in use.' });
      database.posts.push(post); await writeDatabase(database); return send(res, 201, { post });
    }
    const id = cleanText(req.query?.id, 100);
    const index = database.posts.findIndex((item) => item.id === id);
    if (index === -1) return send(res, 404, { error: 'Article not found.' });
    if (req.method === 'PUT' && action === 'post') {
      const post = preparePost(await readBody(req), database.posts[index]);
      if (database.posts.some((item) => item.id !== id && item.slug === post.slug && !item.deletedAt)) return send(res, 409, { error: 'That URL slug is already in use.' });
      database.posts[index] = post; await writeDatabase(database); return send(res, 200, { post });
    }
    if (req.method === 'DELETE' && action === 'post') {
      database.posts[index] = { ...database.posts[index], deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      await writeDatabase(database); return send(res, 200, { post: database.posts[index] });
    }
    if (req.method === 'POST' && action === 'restore') {
      database.posts[index] = { ...database.posts[index], deletedAt: null, updatedAt: new Date().toISOString() };
      await writeDatabase(database); return send(res, 200, { post: database.posts[index] });
    }
    return send(res, 405, { error: 'This request is not supported.' });
  } catch (error) {
    console.error('CMS API error:', error);
    return send(res, 500, { error: 'The publishing service could not complete that request.' });
  }
};
