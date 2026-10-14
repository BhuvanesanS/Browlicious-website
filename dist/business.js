const businessStyle = document.createElement('link');
businessStyle.rel = 'stylesheet';
businessStyle.href = 'business.css';
document.head.append(businessStyle);

const completionStyle = document.createElement('link');
completionStyle.rel = 'stylesheet';
completionStyle.href = 'completion.css';
document.head.append(completionStyle);

const demoBar = document.createElement('div');
demoBar.className = 'draft-note';
demoBar.textContent = 'DRAFT BUSINESS DETAILS — replace these sample details before publishing live.';
document.body.prepend(demoBar);

document.querySelectorAll('.whatsapp-float, a[href^="https://wa.me/"]').forEach((link) => {
  link.href = 'https://wa.me/919876543210?text=Hello%20Browlicious%2C%20I%20would%20like%20to%20make%20an%20enquiry.';
});

const treatmentPage = window.location.pathname.match(/(microblading|ombre-brows|combination-brows|lip-blush|dark-lip-correction|cheek-blush|permanent-eyeliner|smp-men|smp-women|vitiligo-camouflage|stretch-mark-camouflage|scar-camouflage|areola-reconstruction)\.html$/);
if (treatmentPage) {
  document.title = `${document.title} | Chennai`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `${description.content} Book a consultation in Chennai.`;
}

if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
  const proof = document.createElement('section');
  proof.className = 'social-proof';
  proof.innerHTML = '<div class="shell"><div><b>1,200+</b><span>clients treated</span></div><div><b>8+</b><span>years of experience</span></div><div><b>4.9/5</b><span>average client rating</span></div><div><b>250+</b><span>artists trained</span></div></div>';
  document.querySelector('.promise').insertAdjacentElement('afterend', proof);
}

if (window.location.pathname.endsWith('contact.html')) {
  const contact = document.createElement('section');
  contact.className = 'draft-contact';
  contact.innerHTML = '<div class="shell draft-contact-grid"><div><b>Visit us</b><span>18 Rose Avenue, Anna Nagar, Chennai, Tamil Nadu 600040</span></div><div><b>Call or WhatsApp</b><span>+91 98765 43210</span></div><div><b>Email</b><span>hello@browliciouspmu.in</span></div><div><b>Hours</b><span>Tue–Sun, 10:00 AM–7:00 PM</span></div></div>';
  document.querySelector('.contact-options').insertAdjacentElement('afterend', contact);
  const responsePromise = document.querySelector('.appointment-copy p:not(.eyebrow)');
  if (responsePromise) responsePromise.insertAdjacentHTML('afterend', '<p><b>Sample service promise:</b> we reply to consultation and Academy enquiries within 24 hours.</p>');
  const consent = document.querySelector('.consent span');
  if (consent) consent.insertAdjacentHTML('beforeend', ' Read the <a href="privacy.html">draft privacy policy</a>.');
}

if (window.location.pathname.endsWith('academy.html')) {
  const courses = document.createElement('section');
  courses.className = 'academy-draft';
  courses.innerHTML = '<div class="shell"><p class="eyebrow">Draft academy information</p><h2>Professional training<br><i>with ongoing support.</i></h2><div class="academy-draft-grid"><article><h3>Foundation PMU</h3><p>5-day brow foundation course, maximum 6 students, a starter kit, supervised model practice and an accredited course certificate.</p></article><article><h3>Advanced artistry</h3><p>Focused lip, eyeliner and correction training with colour theory, assessment practice and portfolio feedback.</p></article><article><h3>Mentorship</h3><p>12 months of support, alumni community access and business lessons covering pricing, social media and client retention.</p></article></div></div>';
  document.querySelector('main').append(courses);
  const actions = document.createElement('div');
  actions.className = 'shell academy-actions';
  actions.innerHTML = '<a class="button" href="prospectus.html">Download the prospectus <span>↓</span></a><a class="button button-dark" href="contact.html#academy-enquiry">Book a discovery call <span>↗</span></a><a class="button" href="contact.html#academy-enquiry">Apply now <span>→</span></a>';
  courses.insertAdjacentElement('afterend', actions);
}

if (window.location.pathname.endsWith('about.html')) {
  const founder = document.createElement('section');
  founder.className = 'founder-draft';
  founder.innerHTML = '<div class="shell founder-grid"><div class="founder-image"><img src="assets/founder.png" alt="Sample Browlicious founder portrait"></div><div><p class="eyebrow"><span></span> Draft founder story</p><h2>Precision, patience<br>and <i>a soft touch.</i></h2><p>Browlicious began when Maya Kapoor saw how a small change—a defined brow or restored areola—could change how someone feels in the mirror. After eight years in cosmetic and paramedical pigmentation, she built a calm clinic and an Academy designed to raise professional standards.</p><p>Every result is planned, mapped and approved before the first mark is made. We do not follow trends for the sake of it; we design for the long term because PMU stays on your face.</p><div class="credential-list"><span>Certified PMU artist</span><span>Fully insured</span><span>Local-authority registered</span><span>Blood-borne pathogen trained</span><span>First-aid certified</span><span>Ongoing CPD learning</span></div></div></div></section>';
  document.querySelector('.about-story').insertAdjacentElement('afterend', founder);
}

if (window.location.pathname.endsWith('blog-plan.html')) {
  const checklist = document.createElement('section');
  checklist.className = 'shell blog-checklist';
  checklist.innerHTML = '<h2>Blog SEO checklist</h2><ul><li>Use the main keyword in the title, first paragraph and one subheading.</li><li>Use H2 and H3 headings, short paragraphs and a clear call to action.</li><li>Link every post to the matching service page and the Academy.</li><li>Add accurate alt text and use real healed photos with consent.</li><li>Keep medical claims cautious and avoid guarantees.</li></ul>';
  document.querySelector('main').append(checklist);
}

if (window.location.pathname.endsWith('areola-reconstruction.html')) {
  const support = document.createElement('p');
  support.className = 'areola-support';
  support.innerHTML = '<b>Sample support pathway:</b> Browlicious can coordinate with a breast-care nurse or surgeon referral pathway and offers a draft 15% restorative-treatment support rate. Replace this policy with the clinic’s final arrangement before launch.';
  document.querySelector('.service-detail').insertAdjacentElement('afterend', support);
}

document.querySelectorAll('footer .footer-bottom').forEach((footer) => {
  footer.insertAdjacentHTML('beforeend', ' <a href="price-list.html">Price list</a> · <a href="prospectus.html">Academy prospectus</a> · <a href="blog-plan.html">Blog plan</a> · <a href="privacy.html">Privacy</a>');
});
