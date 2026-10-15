const state = { posts: [], selectedId: null, filter: 'active' };
const $ = (id) => document.getElementById(id);
const fields = ['title', 'slug', 'excerpt', 'body', 'cover-image', 'cover-alt', 'seo-title', 'seo-description', 'author', 'status'];
const key = (field) => field.replace(/-([a-z])/g, (_, character) => character.toUpperCase());

async function request(action, options = {}) {
  const response = await fetch(`/api/cms?action=${action}`, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function escapeHtml(value = '') { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
function setMessage(message, tone = '') { $('form-status').textContent = message; $('form-status').className = `form-status ${tone}`; }
function showCover(url, alt = '') { $('cover-preview').innerHTML = url ? `<img src="${url}" alt="${escapeHtml(alt || 'Cover image preview')}">` : ''; }
function setDeleteDialog(open) { const modal = $('delete-modal'); modal.hidden = !open; modal.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('modal-open', open); if (open) $('delete-confirm').focus(); }
function resetForm() { $('post-form').reset(); $('post-id').value = ''; $('author').value = 'Browlicious team'; $('status').value = 'draft'; $('cover-preview').innerHTML = ''; $('delete-post').hidden = true; $('restore-post').hidden = true; state.selectedId = null; setMessage(''); renderList(); }
function formPost() { return Object.fromEntries(fields.map((field) => [key(field), $(field).value])); }
function selectPost(post) { state.selectedId = post.id; $('post-id').value = post.id; fields.forEach((field) => { $(field).value = post[key(field)] || ''; }); showCover(post.coverImage, post.coverAlt); $('delete-post').hidden = Boolean(post.deletedAt); $('restore-post').hidden = !post.deletedAt; setMessage(post.deletedAt ? 'This item is in the recycle bin.' : 'Editing saved article.'); renderList(); }
function renderList() { const list = $('post-list'); const visible = state.posts.filter((post) => state.filter === 'deleted' ? post.deletedAt : !post.deletedAt); list.innerHTML = visible.length ? visible.map((post) => `<button class="post-item ${post.id === state.selectedId ? 'selected' : ''}" data-id="${post.id}"><strong>${escapeHtml(post.title)}</strong><span>${post.status}${post.publishedAt ? ' · Published' : ''}</span></button>`).join('') : '<p class="empty">No articles here yet.</p>'; list.querySelectorAll('[data-id]').forEach((button) => button.addEventListener('click', () => selectPost(state.posts.find((post) => post.id === button.dataset.id)))); }
async function loadPosts() { state.posts = (await request('manage-posts')).posts; renderList(); }

$('new-post').addEventListener('click', resetForm);
$('post-filter').addEventListener('change', (event) => { state.filter = event.target.value; resetForm(); });
$('title').addEventListener('input', () => { if (!$('slug').dataset.manual) $('slug').value = $('title').value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 110); if (!$('seo-title').value) $('seo-title').value = $('title').value; });
$('slug').addEventListener('input', () => { $('slug').dataset.manual = 'true'; });
$('cover-file').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return setMessage('Image must be smaller than 4 MB.', 'error'); $('upload-status').textContent = 'Uploading image…'; const reader = new FileReader(); reader.onload = async () => { try { const media = await request('media', { method: 'POST', body: JSON.stringify({ dataUrl: reader.result }) }); $('cover-image').value = media.url; showCover(media.url, $('cover-alt').value); $('upload-status').textContent = 'Image uploaded.'; } catch (error) { $('upload-status').textContent = error.message; } }; reader.readAsDataURL(file); });
$('post-form').addEventListener('submit', async (event) => { event.preventDefault(); try { const id = $('post-id').value; const action = id ? `post&id=${encodeURIComponent(id)}` : 'post'; const result = await request(action, { method: id ? 'PUT' : 'POST', body: JSON.stringify(formPost()) }); await loadPosts(); selectPost(result.post); setMessage(result.post.status === 'published' ? 'Article published successfully.' : 'Draft saved successfully.', 'success'); } catch (error) { setMessage(error.message, 'error'); } });
$('delete-post').addEventListener('click', () => { const title = $('title').value || 'this article'; $('delete-modal-copy').textContent = `“${title}” will disappear from the public journal immediately. You can restore it later from the Recycle bin.`; setDeleteDialog(true); });
$('delete-cancel').addEventListener('click', () => setDeleteDialog(false));
$('delete-cancel-icon').addEventListener('click', () => setDeleteDialog(false));
$('delete-modal').addEventListener('click', (event) => { if (event.target === $('delete-modal')) setDeleteDialog(false); });
$('delete-confirm').addEventListener('click', async () => { const id = $('post-id').value; if (!id) return setDeleteDialog(false); $('delete-confirm').disabled = true; $('delete-confirm').textContent = 'Moving article…'; try { await request(`post&id=${encodeURIComponent(id)}`, { method: 'DELETE' }); setDeleteDialog(false); await loadPosts(); resetForm(); setMessage('Article moved to recycle bin. You can restore it at any time.', 'success'); } catch (error) { setMessage(error.message, 'error'); } finally { $('delete-confirm').disabled = false; $('delete-confirm').textContent = 'Move to recycle bin'; } });
$('restore-post').addEventListener('click', async () => { const id = $('post-id').value; if (!id) return; try { const result = await request(`restore&id=${encodeURIComponent(id)}`, { method: 'POST' }); await loadPosts(); state.filter = 'active'; $('post-filter').value = 'active'; selectPost(result.post); setMessage('Article restored.', 'success'); } catch (error) { setMessage(error.message, 'error'); } });
$('preview').addEventListener('click', () => { const slug = $('slug').value; if (!slug) return setMessage('Save the article first to preview it.', 'error'); window.open(`/blog/${encodeURIComponent(slug)}`, '_blank', 'noopener'); });

document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('delete-modal').hidden) setDeleteDialog(false); });
(async () => { try { const access = await request('status'); if (!access.allowed) { $('access-message').innerHTML = `<strong>Publishing is protected.</strong><br>Your current network address is <code>${escapeHtml(access.yourIp)}</code>. Add this address to the Vercel environment variable <code>CMS_ALLOWED_IPS</code>, then redeploy to activate this editor.`; return; } $('access-message').remove(); $('app').hidden = false; await loadPosts(); } catch { $('access-message').textContent = 'Unable to connect to the publishing service.'; } })();
