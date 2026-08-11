const fs = require('fs');
const p = 'resources/js/Pages/Assistant/Dashboard.jsx';
let s = fs.readFileSync(p, 'utf8');
const marker = '/* ─── Stat Card';
const first = s.indexOf('const O =');
const second = s.indexOf('const O =', first + 1);
if (first !== -1 && second !== -1) {
	const statPos = s.indexOf(marker, second);
	if (statPos !== -1) {
		// remove the duplicate block from second to statPos
		s = s.slice(0, second) + s.slice(statPos);
		// ensure there is a single C object before statPos: if missing closing brace, fix it
		const beforeStat = s.slice(0, s.indexOf(marker));
		if (!/\}[^\n]*\n\s*$/.test(beforeStat)) {
			// try to close the object
			s = s.replace(/(const C = \{[\s\S]*?)$/m, '$1\n};\n');
		}
	}
}
fs.writeFileSync(p, s, 'utf8');
console.log('patched', p);
