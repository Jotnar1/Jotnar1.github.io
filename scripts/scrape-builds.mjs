const slug = process.argv[2] || 'arthas';
const url = `https://www.icy-veins.com/heroes/${slug}-build-guide`;
const res = await fetch(url);
const html = await res.text();
console.log('status', res.status, 'length', html.length);

const buildBlocks = [...html.matchAll(/data-build-id="(\d+)"[^>]*data-build-name="([^"]+)"/g)];
console.log('build blocks', buildBlocks.length);

const talentRows = [...html.matchAll(/data-level="(\d+)"[^>]*data-talent-name="([^"]+)"/g)];
console.log('talent rows sample', talentRows.slice(0, 14).map((m) => `${m[1]}:${m[2]}`));

const alt = [...html.matchAll(/"level":(\d+),"name":"([^"]+)"/g)];
console.log('json talents sample', alt.slice(0, 14).map((m) => `${m[1]}:${m[2]}`));
