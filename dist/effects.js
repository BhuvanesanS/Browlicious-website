(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const privatePage = document.querySelector('meta[name="robots"][content*="noindex"]');
  const canonicalUrl = `${window.location.origin}${window.location.pathname === '/index.html' ? '/' : window.location.pathname}`;

  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = canonicalUrl; document.head.append(canonical);
  }
  if (!privatePage) {
    const description = document.querySelector('meta[name="description"]')?.content || 'Browlicious PMU Clinic & Academy — bespoke permanent makeup, restoration and professional training.';
    const social = { 'og:type': 'website', 'og:site_name': 'Browlicious PMU Clinic & Academy', 'og:title': document.title, 'og:description': description, 'og:url': canonicalUrl, 'og:image': `${window.location.origin}/assets/hero.jpg`, 'twitter:card': 'summary_large_image', 'twitter:title': document.title, 'twitter:description': description, 'twitter:image': `${window.location.origin}/assets/hero.jpg` };
    Object.entries(social).forEach(([name, content]) => { const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`; if (!document.querySelector(selector)) { const meta = document.createElement('meta'); if (name.startsWith('og:')) meta.setAttribute('property', name); else meta.name = name; meta.content = content; document.head.append(meta); } });
  }

  const stylesheet = document.createElement('link'); stylesheet.rel = 'stylesheet'; stylesheet.href = '/effects.css'; document.head.append(stylesheet);
  const loader = document.createElement('div'); loader.className = 'site-loader'; loader.setAttribute('aria-hidden', 'true'); loader.innerHTML = '<div class="loader-inner"><div class="loader-mark">B</div><span>Browlicious</span><div class="loader-progress"></div></div>'; document.body.append(loader);
  const hideLoader = () => window.setTimeout(() => { loader.classList.add('is-hidden'); window.setTimeout(() => loader.remove(), 500); }, reducedMotion ? 0 : 420);
  if (document.readyState === 'complete') hideLoader(); else window.addEventListener('load', hideLoader, { once: true });

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.body.classList.add('has-custom-cursor');
    const dot = document.createElement('i'); const ring = document.createElement('i'); dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; document.body.append(dot, ring);
    window.addEventListener('pointermove', (event) => { dot.style.left = `${event.clientX}px`; dot.style.top = `${event.clientY}px`; ring.style.left = `${event.clientX}px`; ring.style.top = `${event.clientY}px`; }, { passive: true });
    document.querySelectorAll('a, button, input, select, textarea, summary').forEach((element) => { element.addEventListener('pointerenter', () => ring.classList.add('is-hover')); element.addEventListener('pointerleave', () => ring.classList.remove('is-hover')); });
  }

  if (!reducedMotion) document.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', (event) => {
    const url = new URL(link.href, window.location.origin);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || link.target || link.hasAttribute('download') || url.origin !== window.location.origin || url.pathname === window.location.pathname || url.hash) return;
    event.preventDefault(); loader.classList.remove('is-hidden'); window.setTimeout(() => { window.location.href = url.href; }, 210);
  }));
})();
