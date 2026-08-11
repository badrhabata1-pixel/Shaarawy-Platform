const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

function walk(dir, files=[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.isFile() && /\.(js|jsx|ts|tsx)$/.test(e.name)) files.push(full);
  }
  return files;
}

const root = path.join(__dirname, '..', 'resources', 'js');
if (!fs.existsSync(root)) {
  console.error('resources/js not found');
  process.exit(1);
}

const files = walk(root);
let errorCount = 0;
for (const f of files) {
  try {
    const code = fs.readFileSync(f, 'utf8');
    parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
    });
  } catch (err) {
    errorCount++;
    console.error(`\nERROR in ${f}`);
    console.error(err.message);
  }
}

console.log(`\nChecked ${files.length} files. Errors: ${errorCount}`);
process.exit(errorCount?1:0);
