const state = { posts: [], selectedId: null, filter: 'active' };
const $ = (id) => document.getElementById(id);
const fields = ['title', 'slug', 'excerpt', 'body', 'cover-image', 'cover-alt', 'seo-title', 'seo-description', 'author', 'status'];

async function request(url, options) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

function setMessage(message, tone = '') { $('form-status').textContent = message; $('form-status').className = `form-status ${tone}`; }
function resetForm() { $('post-form').reset(); $('post-id').value = ''; $('author').value = 'Browlicious team'; $('status').value = 'draft'; $('cover-preview').innerHTML = ''; $('delete-post').hidden = true; $('restore-post').hidden = true; state.selectedId = null; setMessage(''); renderList(); }
function formPost() { return Object.fromEntries(fields.map((field) => [field.replace(/-([a-z])/g, (_, char) => char.toUpperCase()), $(field).value])); }
function showCover(url, alt = '') { $('cover-preview').innerHTML = url ? `<img src="${url}" alt="${alt || 'Cover image preview'}">` : ''; }

function selectPost(post) {
  state.selectedId = post.id; $('post-id').value = post.id;
  for (const field of fields) $(field).value = post[field.replace(/-([a-z])/g, (_, char) => char.toUpperCase())] || '';
  showCover(post.coverImage, post.coverAlt); $('delete-post').hidden = Boolean(post.deletedAt); $('restore-post').hidden = !post.deletedAt; setMessage(post.deletedAt ? 'This item is in the recycle bin.' : 'Editing saved article.'); renderList();
}

function renderList() {
  const list = $('post-list'); const visible = state.posts.filter((post) => state.filter === 'deleted' ? post.deletedAt : !post.deletedAt);
  list.innerHTML = visible.length ? visible.map((post) => `<button class="post-item ${post.id === state.selectedId ? 'selected' : ''}" data-id="${post.id}"><strong>${escapeForHtml(post.title)}</strong><span>${post.status}${post.publishedAt ? ' · Published' : ''}</span></button>`).join('') : '<p class="empty">No articles here yet.</p>';
  list.querySelectorAll('[data-id]').forEach((button) => button.addEventListener('click', () => selectPost(state.posts.find((post) => post.id === button.dataset.id))));
}
function escapeForHtml(value = '') { const item = document.createElement('span'); item.textContent = value; return item.innerHTML; }
async function loadPosts() { state.posts = await request('/api/admin/posts'); renderList(); }

$('new-post').addEventListener('click', resetForm);
$('post-filter').addEventListener('change', (event) => { state.filter = event.target.value; resetForm(); });
$('title').addEventListener('input', () => { if (!$('slug').dataset.manual) $('slug').value = $('title').value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 110); if (!$('seo-title').value) $('seo-title').value = $('title').value; });
$('slug').addEventListener('input', () => { $('slug').dataset.manual = 'true'; });

$('cover-file').addEventListener('change', async (event) => {
  const file = event.target.files[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) return setMessage('Image must be smaller than 5 MB.', 'error');
  $('upload-status').textContent = 'Uploading image…';
  const reader = new FileReader(); reader.onload = async () => { try { const media = await request('/api/admin/media', { method: 'POST', body: JSON.stringify({ filename: file.name, dataUrl: reader.result, alt: $('cover-alt').value }) }); $('cover-image').value = media.url; showCover(media.url, $('cover-alt').value); $('upload-status').textContent = 'Image uploaded.'; } catch (error) { $('upload-status').textContent = error.message; } }; reader.readAsDataURL(file);
});

$('post-form').addEventListener('submit', async (event) => { event.preventDefault(); try { const id = $('post-id').value; const post = await request(id ? `/api/admin/posts/${id}` : '/api/admin/posts', { method: id ? 'PUT' : 'POST', body: JSON.stringify(formPost()) }); await loadPosts(); selectPost(post); setMessage(post.status === 'published' ? 'Article published successfully.' : 'Draft saved successfully.', 'success'); } catch (error) { setMessage(error.message, 'error'); } });
$('delete-post').addEventListener('click', async () => { const id = $('post-id').value; if (!id || !confirm('Move this article to the recycle bin?')) return; try { await request(`/api/admin/posts/${id}`, { method: 'DELETE' }); await loadPosts(); resetForm(); setMessage('Article moved to recycle bin.', 'success'); } catch (error) { setMessage(error.message, 'error'); } });
$('restore-post').addEventListener('click', async () => { const id = $('post-id').value; if (!id) return; try { const post = await request(`/api/admin/posts/${id}/restore`, { method: 'POST' }); await loadPosts(); state.filter = 'active'; $('post-filter').value = 'active'; selectPost(post); setMessage('Article restored.', 'success'); } catch (error) { setMessage(error.message, 'error'); } });
$('preview').addEventListener('click', () => { const slug = $('slug').value; if (!slug) return setMessage('Save the article first to preview it.', 'error'); window.open(`/blog/${encodeURIComponent(slug)}`, '_blank', 'noopener'); });

(async () => { try { const access = await request('/api/admin/status'); if (!access.allowed) { $('access-message').textContent = `This CMS is restricted to approved IP addresses. Your current IP is ${access.yourIp}.`; return; } $('access-message').remove(); $('app').hidden = false; await loadPosts(); } catch { $('access-message').textContent = 'Unable to connect to the CMS server.'; } })();
