const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'dist');
const output = path.join(root, '.vercel', 'output');
const staticOutput = path.join(output, 'static');

async function build() {
  await fs.access(path.join(source, 'index.html'));
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(staticOutput, { recursive: true });
  await fs.cp(source, staticOutput, { recursive: true });
  await fs.writeFile(path.join(output, 'config.json'), JSON.stringify({ version: 3 }, null, 2));
  console.log('Created Vercel static output from dist/.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
