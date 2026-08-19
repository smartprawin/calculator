const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dest = path.join(root, 'www');

const files = [
  'index.html', 'emi.html', 'tax.html', 'ebbill.html', 'privacy.html',
  'common.js', 'emi.js', 'ebbill.js', 'tax.js', 'style.css',
  'favicon.png', 'og-image.png', 'manifest.webmanifest', 'sw.js',
  'robots.txt', 'sitemap.xml'
];

fs.mkdirSync(dest, { recursive: true });
for (const f of files) {
  const from = path.join(root, f);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(dest, f));
}
console.log('Copied web assets to www/ (' + files.length + ' entries)');
