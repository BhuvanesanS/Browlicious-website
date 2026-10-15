const pageStyles = document.createElement('link');
pageStyles.rel = 'stylesheet';
pageStyles.href = 'extra.css';
document.head.append(pageStyles);

const motionStyles = document.createElement('link');
motionStyles.rel = 'stylesheet';
motionStyles.href = 'motion.css';
document.head.append(motionStyles);

const resourceStyles = document.createElement('link');
resourceStyles.rel = 'stylesheet';
resourceStyles.href = 'resources.css';
document.head.append(resourceStyles);

const guideStyles = document.createElement('link');
guideStyles.rel = 'stylesheet';
guideStyles.href = 'guide.css';
document.head.append(guideStyles);

const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'enhancements.css';
document.head.append(enhancementStyles);

const layoutFixStyles = document.createElement('link');
layoutFixStyles.rel = 'stylesheet';
layoutFixStyles.href = 'layout-fix.css';
document.head.append(layoutFixStyles);

const directoryStyles = document.createElement('link');
directoryStyles.rel = 'stylesheet';
directoryStyles.href = 'directory.css';
document.head.append(directoryStyles);

const businessScript = document.createElement('script');
businessScript.src = 'business.js';
businessScript.defer = true;
document.head.append(businessScript);

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'favicon.svg';
document.head.append(favicon);

const manifest = document.createElement('link');
manifest.rel = 'manifest';
manifest.href = 'manifest.webmanifest';
document.head.append(manifest);

const menu = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
if (menu && links) {
  if (!links.querySelector('[href="/blog"]')) {
    const journalLink = document.createElement('a');
    journalLink.href = '/blog/';
    journalLink.textContent = 'Journal';
    links.insertBefore(journalLink, links.firstElementChild);
  }
  if (!links.querySelector('[href="resources.html"]')) {
    const resourcesLink = document.createElement('a');
    resourcesLink.href = 'resources.html';
    resourcesLink.textContent = 'Resources';
    links.insertBefore(resourcesLink, links.lastElementChild);
  }
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));

  links.querySelectorAll('a').forEach((link) => {
    const destination = new URL(link.href, window.location.origin).pathname;
    if (destination === window.location.pathname || (destination === '/index.html' && window.location.pathname === '/')) link.classList.add('active');
  });
}

if (window.location.pathname.endsWith('treatments.html')) {
  const main = document.querySelector('main');
  const guideLink = document.createElement('section');
  guideLink.className = 'guide-callout';
  guideLink.innerHTML = '<div class="shell"><div><p class="eyebrow"><span></span> Need the full picture?</p><h2>Compare every PMU<br><i>treatment in detail.</i></h2></div><a class="button" href="treatment-guide.html">Open the complete guide <span>→</span></a></div>';
  main.append(guideLink);
}

if (window.location.pathname.endsWith('treatment-guide.html')) {
  const main = document.querySelector('main');
  const directory = document.createElement('section');
  directory.className = 'service-directory';
  directory.innerHTML = '<div class="shell"><a href="microblading.html">Microblading</a><a href="ombre-brows.html">Ombre brows</a><a href="combination-brows.html">Combination brows</a><a href="lip-blush.html">Lip blush</a><a href="dark-lip-correction.html">Dark lip correction</a><a href="cheek-blush.html">Cheek blush</a><a href="permanent-eyeliner.html">Permanent eyeliner</a><a href="smp-men.html">SMP for men</a><a href="smp-women.html">SMP for women</a><a href="vitiligo-camouflage.html">Vitiligo camouflage</a><a href="stretch-mark-camouflage.html">Stretch-mark camouflage</a><a href="scar-camouflage.html">Scar camouflage</a><a href="areola-reconstruction.html">Areola reconstruction</a></div>';
  main.querySelector('.guide-nav').insertAdjacentElement('afterend', directory);
  const faq = document.createElement('section');
  faq.className = 'faq shell document-faq';
  faq.innerHTML = '<div class="section-head reveal"><div><p class="eyebrow"><span></span> More answers</p><h2>Know before<br><i>you book.</i></h2></div></div><div class="faq-grid"><details class="reveal"><summary>Will my colour change as it heals?<span>+</span></summary><p>Yes. Pigment looks darker at first and typically softens by around 30 to 40 percent. Your artist selects shades with this healing process in mind.</p></details><details class="reveal"><summary>Is PMU safe?<span>+</span></summary><p>Safety depends on suitability screening and professional hygiene. Browlicious uses single-use sterile needles, medical-grade pigments, strict sterilisation and a health screen before treatment.</p></details><details class="reveal"><summary>What does treatment cost?<span>+</span></summary><p>Pricing depends on the treatment and area. A final quote should be confirmed by the clinic before booking; the perfecting session is included where stated in your plan.</p></details><details class="reveal"><summary>Can PMU be removed?<span>+</span></summary><p>It can sometimes be faded with laser or saline removal, but the process is gradual and may not be complete. Choosing an appropriate artist and treatment plan matters.</p></details></div>';
  main.insertBefore(faq, main.querySelector('.page-cta'));
  faq.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('is-visible');
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const form = document.getElementById('appointment-form');
if (form) form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    'Hello Browlicious, I would like to make an enquiry.',
    `Name: ${data.get('name')}`,
    `Phone: ${data.get('phone')}`,
    `Email: ${data.get('email')}`,
    `Interest: ${data.get('interest')}`,
    data.get('date') ? `Preferred date: ${data.get('date')}` : '',
    data.get('message') ? `Message: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  form.querySelector('.form-status').textContent = 'Your enquiry has been prepared for WhatsApp.';
});
