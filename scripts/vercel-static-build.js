const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'dist');
const reactSource = path.join(root, 'react-dist');
const output = path.join(root, 'public');
const adminStyles = path.join(root, 'cms', 'cms.css');
const journalStyles = path.join(root, 'cms', 'journal.css');
const journalEnhancements = path.join(root, 'cms', 'journal-enhancements.css');
const JOURNAL_STYLE_VERSION = '20261024-2';
const journalHeader = `<div class="journal-announcement">BROWLICIOUS PMU CLINIC &amp; ACADEMY</div><header class="journal-header"><nav class="journal-nav" aria-label="Primary navigation"><a class="journal-brand" href="/"><span class="journal-brand-mark">B</span><span>Browlicious<small>PMU Clinic &amp; Academy</small></span></a><div class="journal-links"><a class="active" href="/blog">Journal</a><a href="/">Home</a><a href="/services">Treatments</a><a href="/academy">Academy</a><a href="/about">About</a><a href="/resources">Resources</a><a href="/contact">Contact</a></div><a class="journal-cta" href="/contact">Book a consultation <span>↗</span></a></nav></header>`;

async function updateJournalTemplate(filename) {
  const target = path.join(output, 'blog', filename);
  const template = await fs.readFile(target, 'utf8');
  const withFreshStyles = template.replace(
    /<link rel="stylesheet" href="\/admin-cms\.css"><link rel="stylesheet" href="\/portal-motion\.css">/,
    `<link rel="stylesheet" href="/admin-cms.css?v=${JOURNAL_STYLE_VERSION}"><link rel="stylesheet" href="/journal.css?v=${JOURNAL_STYLE_VERSION}"><link rel="stylesheet" href="/journal-enhancements.css?v=${JOURNAL_STYLE_VERSION}">`,
  );
  const withSharedHeader = withFreshStyles.replace(/<body><header[\s\S]*?<\/header>/, `<body>${journalHeader}`);
  const withDedicatedCallout = withSharedHeader.replace('<section class="journal-cta">', '<section class="journal-callout">');
  await fs.writeFile(target, withDedicatedCallout);
}

async function build() {
  await fs.access(path.join(source, 'index.html'));
  await fs.access(path.join(reactSource, 'index.html'));
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  await fs.cp(source, output, { recursive: true });
  await fs.cp(reactSource, output, { recursive: true, force: true });
  await fs.copyFile(adminStyles, path.join(output, 'admin-cms.css'));
  await fs.copyFile(journalStyles, path.join(output, 'journal.css'));
  await fs.copyFile(journalEnhancements, path.join(output, 'journal-enhancements.css'));
  await Promise.all([updateJournalTemplate('index.html'), updateJournalTemplate('post.html')]);
  console.log('Created Vercel public assets from the legacy CMS and React build.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
