const fs = require('fs');
const path = require('path');

const PL_DIR = path.join(__dirname, '../src/pages/pl');
const EN_DIR = path.join(__dirname, '../src/pages/en');

function fixDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fixDirectory(filePath);
    } else if (filePath.endsWith('.astro')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace "/assets/" with "../assets/" only if it is not already preceded by "."
      // Also make sure we don't double prepend if it is already relative
      let updated = false;
      
      // Match "/assets/" when it is preceded by a quote, e.g. src="/assets/" or href="/assets/"
      const absoluteAssetRegex = /(["'])\/assets\//g;
      if (absoluteAssetRegex.test(content)) {
        content = content.replace(absoluteAssetRegex, '$1../assets/');
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Relativized assets in: ${filePath}`);
      }
    }
  });
}

console.log('Starting asset link relativization on page templates...');
fixDirectory(PL_DIR);
fixDirectory(EN_DIR);
console.log('Asset link relativization complete!');
