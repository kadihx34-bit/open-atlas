import fs from 'node:fs';
import path from 'node:path';

const root = '/home/ubuntu/uiverse-galaxy';
const out = '/home/ubuntu/open-design-atlas/client/src/data/uiverse-registry.json';
const files = fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html') && !file.startsWith('.'));
const components = files.map((relativePath, index) => {
  const absolutePath = path.join(root, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const category = relativePath.split(path.sep)[0];
  const slug = path.basename(relativePath, '.html');
  const clean = slug.replace(/^[^_]+_/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  const styleMatch = source.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const css = styleMatch?.[1]?.trim() ?? '';
  const html = bodyMatch?.[1]?.trim() ?? source.replace(/<style[\s\S]*?<\/style>/gi, '').trim();
  return {
    id: `uiverse-${index + 1}`,
    name: clean,
    category,
    slug,
    source: 'Uiverse Galaxy',
    license: 'MIT',
    attribution: 'Uiverse.io community creator',
    sourceUrl: `https://uiverse.io/`,
    code: { html, css },
  };
});
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), source: 'https://github.com/uiverse-io/galaxy', license: 'MIT', total: components.length, components }, null, 2));
console.log(`Imported ${components.length} Uiverse components to ${out}`);
