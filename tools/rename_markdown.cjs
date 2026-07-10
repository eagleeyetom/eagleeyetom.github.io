const fs = require('fs');
const path = require('path');

const PL_DIR = path.join(__dirname, '../src/content/theatres/pl');
const EN_DIR = path.join(__dirname, '../src/content/theatres/en');

const plRenames = {
  'baltazar.md': 'teatr-baltazar.md',
  'danza-mobile.md': 'teatr-danza-mobile.md',
  'krug-ii.md': 'teatr-krug-ii.md',
  'lik.md': 'teatr-lik.md',
  'otczapy.md': 'teatr-otczapy.md',
  'parostky-happy-exiles.md': 'teatr-parostky-szczesliwi-wygnancy.md',
  'parostky.md': 'teatr-parostky.md',
  'rambazamba.md': 'teatr-rambazamba.md',
  'tur.md': 'teatr-tur.md',
  'mtt.md': 'trupa-mtt.md'
};

const enRenames = {
  'mtt.md': 'troupe-mtt.md',
  'otczapy.md': 'otczapy-theater.md'
};

console.log('Renaming PL Markdown files...');
for (const [oldName, newName] of Object.entries(plRenames)) {
  const oldPath = path.join(PL_DIR, oldName);
  const newPath = path.join(PL_DIR, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed PL: ${oldName} -> ${newName}`);
  }
}

console.log('Renaming EN Markdown files...');
for (const [oldName, newName] of Object.entries(enRenames)) {
  const oldPath = path.join(EN_DIR, oldName);
  const newPath = path.join(EN_DIR, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed EN: ${oldName} -> ${newName}`);
  }
}

console.log('Markdown renaming complete!');
