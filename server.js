/*
 * Browlicious custom CMS
 * No hosted CMS, authentication provider, or database service is required.
 * Administrators are authorised by their IP address (CMS_ALLOWED_IPS).
 */
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const STATIC_DIR = path.join(ROOT, 'dist');
const DATA_DIR = path.resolve(process.env.CMS_DATA_DIR || path.join(ROOT, 'data'));
const UPLOAD_DIR = path.resolve(process.env.CMS_UPLOAD_DIR || path.join(ROOT, 'uploads'));
const DB_FILE = path.join(DATA_DIR, 'cms.json');
const PORT = Number(process.env.PORT || 8003);
const APP_URL = (process.env.APP_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, '');
const TRUST_PROXY = process.env.TRUST_PROXY === 'true';
const ALLOWED_IPS = new Set((process.env.CMS_ALLOWED_IPS || '127.0.0.1,::1')
  .split(',').map(normalizeIp).filter(Boolean));
const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MIME = { '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8', '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

function normalizeIp(ip = '') {
  return String(ip).trim().replace(/^::ffff:/, '').replace(/^\[|\]$/g, '');
}

function clientIp(req) {
  const forwarded = TRUST_PROXY ? req.headers['x-forwarded-for'] : '';
  return normalizeIp(forwarded ? String(forwarded).split(',')[0] : req.socket.remoteAddress);
}

function isAdminRequest(req) {
  return ALLOWED_IPS.has(clientIp(req));
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', ...headers });
  res.end(body);
}

function json(res, status, payload) {
  send(res, status, JSON.stringify(payload), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function markdownToHtml(source = '') {
  const lines = escapeHtml(source).split(/\r?\n/);
  const output = [];
  let inList = false;
  const inline = (text) => text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>');
  for (const raw of lines) {
    const line = raw.trim();
    if (/^###\s+/.test(line)) { if (inList) { output.push('</ul>'); inList = false; } output.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (/^##\s+/.test(line)) { if (inList) { output.push('</ul>'); inList = false; } output.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^#\s+/.test(line)) { if (inList) { output.push('</ul>'); inList = false; } output.push(`<h1>${inline(line.slice(2))}</h1>`); }
    else if (/^[-*]\s+/.test(line)) { if (!inList) { output.push('<ul>'); inList = true; } output.push(`<li>${inline(line.slice(2))}</li>`); }
    else if (!line) { if (inList) { output.push('</ul>'); inList = false; } }
    else { if (inList) { output.push('</ul>'); inList = false; } output.push(`<p>${inline(line)}</p>`); }
  }
  if (inList) output.push('</ul>');
  return output.join('\n');
}

function slugify(input = '') {
  return String(input).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 110);
}

function isoNow() { return new Date().toISOString(); }

async function initialize() {
  await Promise.all([fs.mkdir(DATA_DIR, { recursive: true }), fs.mkdir(UPLOAD_DIR, { recursive: true })]);
  try { await fs.access(DB_FILE); } catch { await saveDb({ posts: [], media: [], revisions: [] }); }
}

async function db() {
  try {
    const parsed = JSON.parse(await fs.readFile(DB_FILE, 'utf8'));
    return { posts: Array.isArray(parsed.posts) ? parsed.posts : [], media: Array.isArray(parsed.media) ? parsed.media : [], revisions: Array.isArray(parsed.revisions) ? parsed.revisions : [] };
  } catch { return { posts: [], media: [], revisions: [] }; }
}

async function saveDb(data) {
  const temporary = `${DB_FILE}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(temporary, DB_FILE);
}

function publicPost(post) {
  return { id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, body: post.body, coverImage: post.coverImage || '', coverAlt: post.coverAlt || '', seoTitle: post.seoTitle || '', seoDescription: post.seoDescription || '', publishedAt: post.publishedAt, updatedAt: post.updatedAt, author: post.author || 'Browlicious team' };
}

function validatePost(input, existing, records) {
  const title = String(input.title || '').trim().slice(0, 160);
  const slug = slugify(input.slug || title);
  const body = String(input.body || '').trim().slice(0, 50000);
  const status = input.status === 'published' ? 'published' : 'draft';
  if (!title || !slug || !body) return { error: 'Title, slug and article content are required.' };
  if (records.some((post) => post.slug === slug && post.id !== existing?.id)) return { error: 'This URL slug is already being used.' };
  return { value: { title, slug, body, status, excerpt: String(input.excerpt || '').trim().slice(0, 320), coverImage: String(input.coverImage || '').trim().slice(0, 260), coverAlt: String(input.coverAlt || '').trim().slice(0, 180), seoTitle: String(input.seoTitle || title).trim().slice(0, 180), seoDescription: String(input.seoDescription || input.excerpt || '').trim().slice(0, 320), author: String(input.author || 'Browlicious team').trim().slice(0, 80) } };
}

function pageLayout({ title, description, content, canonical, image = '' }) {
  const absoluteImage = image && (image.startsWith('http') ? image : `${APP_URL}${image}`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${escapeHtml(canonical)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">${absoluteImage ? `<meta property="og:image" content="${escapeHtml(absoluteImage)}">` : ''}<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/cms/cms.css"></head><body><header class="site-header"><a class="logo" href="/">Browlicious <span>PMU Clinic &amp; Academy</span></a><nav><a href="/">Home</a><a href="/blog">Journal</a><a href="/contact.html">Contact</a></nav></header>${content}<footer>© ${new Date().getFullYear()} Browlicious PMU Clinic &amp; Academy</footer></body></html>`;
}

function blogIndex(posts) {
  const cards = posts.length ? posts.map((post) => `<article class="post-card">${post.coverImage ? `<img src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.coverAlt || post.title)}">` : ''}<div><p class="post-date">${new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(post.publishedAt))}</p><h2><a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.excerpt || '')}</p><a class="read-more" href="/blog/${encodeURIComponent(post.slug)}">Read article →</a></div></article>`).join('') : '<p class="empty">New journal articles will appear here soon.</p>';
  return pageLayout({ title: 'Journal | Browlicious', description: 'Practical permanent makeup and PMU Academy guidance from Browlicious.', canonical: `${APP_URL}/blog`, content: `<main class="blog-wrap"><p class="eyebrow">Browlicious journal</p><h1>Knowledge for your <em>PMU journey.</em></h1><p class="intro">Treatment education, aftercare and academy advice from Browlicious.</p><section class="post-grid">${cards}</section></main>` });
}

function postPage(post) {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || '';
  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(post.publishedAt));
  return pageLayout({ title: `${title} | Browlicious`, description, canonical: `${APP_URL}/blog/${encodeURIComponent(post.slug)}`, image: post.coverImage, content: `<main class="article-wrap"><a class="back" href="/blog">← Back to journal</a><p class="post-date">${date} · ${escapeHtml(post.author || 'Browlicious team')}</p><h1>${escapeHtml(post.title)}</h1>${post.excerpt ? `<p class="article-intro">${escapeHtml(post.excerpt)}</p>` : ''}${post.coverImage ? `<img class="article-cover" src="${escapeHtml(post.coverImage)}" alt="${escapeHtml(post.coverAlt || post.title)}">` : ''}<article class="article-content">${markdownToHtml(post.body)}</article></main>` });
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error('Request is too large.'); }
  try { return body ? JSON.parse(body) : {}; } catch { throw new Error('Invalid JSON request body.'); }
}

async function serveFile(res, base, requestPath) {
  const relative = requestPath === '/' ? 'index.html' : decodeURIComponent(requestPath).replace(/^\/+/, '');
  const candidate = path.resolve(base, relative);
  if (!candidate.startsWith(path.resolve(base) + path.sep)) return send(res, 403, 'Forbidden');
  try {
    const data = await fs.readFile(candidate);
    send(res, 200, data, { 'Content-Type': MIME[path.extname(candidate).toLowerCase()] || 'application/octet-stream', 'Cache-Control': path.extname(candidate) ? 'public, max-age=3600' : 'no-cache' });
  } catch { send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' }); }
}

async function handleApi(req, res, pathname) {
  const data = await db();
  const parts = pathname.split('/').filter(Boolean);
  const requireAdmin = () => {
    if (!isAdminRequest(req)) { json(res, 403, { error: 'CMS access is restricted to approved IP addresses.', yourIp: clientIp(req) }); return false; }
    return true;
  };
  if (pathname === '/api/posts' && req.method === 'GET') return json(res, 200, data.posts.filter((post) => post.status === 'published' && !post.deletedAt).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).map(publicPost));
  if (parts[0] === 'api' && parts[1] === 'posts' && parts[2] && req.method === 'GET') {
    const post = data.posts.find((item) => item.slug === parts[2] && item.status === 'published' && !item.deletedAt);
    return post ? json(res, 200, publicPost(post)) : json(res, 404, { error: 'Post not found.' });
  }
  if (pathname === '/api/admin/status' && req.method === 'GET') return json(res, 200, { allowed: isAdminRequest(req), yourIp: clientIp(req) });
  if (!pathname.startsWith('/api/admin/')) return json(res, 404, { error: 'API route not found.' });
  if (!requireAdmin()) return;
  if (pathname === '/api/admin/posts' && req.method === 'GET') return json(res, 200, data.posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  if (pathname === '/api/admin/posts' && req.method === 'POST') {
    const input = await readJson(req); const checked = validatePost(input, null, data.posts);
    if (checked.error) return json(res, 422, { error: checked.error });
    const now = isoNow(); const post = { id: crypto.randomUUID(), ...checked.value, createdAt: now, updatedAt: now, publishedAt: checked.value.status === 'published' ? now : null, deletedAt: null };
    data.posts.push(post); data.revisions.push({ id: crypto.randomUUID(), postId: post.id, body: post.body, title: post.title, createdAt: now, action: 'created' }); await saveDb(data);
    return json(res, 201, post);
  }
  if (parts[1] === 'admin' && parts[2] === 'posts' && parts[3]) {
    const post = data.posts.find((item) => item.id === parts[3]);
    if (!post) return json(res, 404, { error: 'Post not found.' });
    if (parts[4] === 'restore' && req.method === 'POST') {
      post.deletedAt = null; post.updatedAt = isoNow(); await saveDb(data);
      return json(res, 200, post);
    }
    if (req.method === 'PUT') {
      const input = await readJson(req); const checked = validatePost(input, post, data.posts);
      if (checked.error) return json(res, 422, { error: checked.error });
      data.revisions.push({ id: crypto.randomUUID(), postId: post.id, body: post.body, title: post.title, createdAt: isoNow(), action: 'updated' });
      Object.assign(post, checked.value, { updatedAt: isoNow(), publishedAt: checked.value.status === 'published' && !post.publishedAt ? isoNow() : post.publishedAt }); await saveDb(data);
      return json(res, 200, post);
    }
    if (req.method === 'DELETE') { post.deletedAt = isoNow(); post.updatedAt = isoNow(); await saveDb(data); return json(res, 200, { ok: true }); }
  }
  if (pathname === '/api/admin/media' && req.method === 'GET') return json(res, 200, data.media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  if (pathname === '/api/admin/media' && req.method === 'POST') {
    const input = await readJson(req); const match = String(input.dataUrl || '').match(/^data:(image\/(?:png|jpeg|webp));base64,([a-zA-Z0-9+/=]+)$/);
    if (!match) return json(res, 422, { error: 'Upload a PNG, JPEG, or WebP image.' });
    const buffer = Buffer.from(match[2], 'base64'); if (!buffer.length || buffer.length > 5 * 1024 * 1024) return json(res, 422, { error: 'Images must be smaller than 5 MB.' });
    const extension = match[1] === 'image/png' ? '.png' : match[1] === 'image/webp' ? '.webp' : '.jpg';
    const fileName = `${crypto.randomUUID()}${extension}`; await fs.writeFile(path.join(UPLOAD_DIR, fileName), buffer);
    const media = { id: crypto.randomUUID(), url: `/uploads/${fileName}`, originalName: String(input.filename || 'image').slice(0, 160), alt: String(input.alt || '').slice(0, 180), mimeType: match[1], createdAt: isoNow() };
    data.media.push(media); await saveDb(data); return json(res, 201, media);
  }
  return json(res, 404, { error: 'Admin API route not found.' });
}

async function requestHandler(req, res) {
  try {
    const url = new URL(req.url, APP_URL); const pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    if (pathname === '/admin' || pathname === '/admin/') return serveFile(res, path.join(ROOT, 'cms'), '/admin.html');
    if (pathname.startsWith('/cms/')) return serveFile(res, path.join(ROOT, 'cms'), pathname.replace('/cms/', '/'));
    if (pathname.startsWith('/uploads/')) return serveFile(res, UPLOAD_DIR, pathname.replace('/uploads/', '/'));
    if (pathname === '/blog' || pathname === '/blog/') { const data = await db(); return send(res, 200, blogIndex(data.posts.filter((post) => post.status === 'published' && !post.deletedAt).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))), { 'Content-Type': 'text/html; charset=utf-8' }); }
    if (pathname.startsWith('/blog/')) { const data = await db(); const slug = pathname.slice('/blog/'.length); const post = data.posts.find((item) => item.slug === slug && item.status === 'published' && !item.deletedAt); return post ? send(res, 200, postPage(post), { 'Content-Type': 'text/html; charset=utf-8' }) : send(res, 404, 'Article not found', { 'Content-Type': 'text/plain; charset=utf-8' }); }
    return serveFile(res, STATIC_DIR, pathname);
  } catch (error) { console.error(error); json(res, 500, { error: 'Server error. Check the server log.' }); }
}

if (require.main === module) {
  initialize().then(() => http.createServer(requestHandler).listen(PORT, () => console.log(`Browlicious CMS running at ${APP_URL} (admin IPs: ${[...ALLOWED_IPS].join(', ')})`)));
} else {
  module.exports = { initialize, requestHandler, markdownToHtml, validatePost };
}
