const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

const plHtml = path.join(distDir, 'pl.html');
const plDestDir = path.join(distDir, 'pl');
const plDestHtml = path.join(plDestDir, 'index.html');

const enHtml = path.join(distDir, 'en.html');
const enDestDir = path.join(distDir, 'en');
const enDestHtml = path.join(enDestDir, 'index.html');

console.log('Running post-build script to align index files...');

// Align Polish index
if (fs.existsSync(plHtml)) {
  if (!fs.existsSync(plDestDir)) {
    fs.mkdirSync(plDestDir, { recursive: true });
  }
  fs.renameSync(plHtml, plDestHtml);
  console.log(`Moved ${plHtml} -> ${plDestHtml}`);
} else {
  console.warn(`Warning: ${plHtml} not found.`);
}

// Align English index
if (fs.existsSync(enHtml)) {
  if (!fs.existsSync(enDestDir)) {
    fs.mkdirSync(enDestDir, { recursive: true });
  }
  fs.renameSync(enHtml, enDestHtml);
  console.log(`Moved ${enHtml} -> ${enDestHtml}`);
} else {
  console.warn(`Warning: ${enHtml} not found.`);
}

console.log('Post-build alignment complete!');
