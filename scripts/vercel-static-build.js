const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'dist');
const output = path.join(root, 'public');
const adminStyles = path.join(root, 'cms', 'cms.css');

async function build() {
  await fs.access(path.join(source, 'index.html'));
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  await fs.cp(source, output, { recursive: true });
  await fs.copyFile(adminStyles, path.join(output, 'admin-cms.css'));
  console.log('Created Vercel public assets from dist/.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
