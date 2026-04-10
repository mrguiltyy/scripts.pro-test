import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const icons = [
  'lucide:search',
  'lucide:x',
  'lucide:star',
  'lucide:flame',
  'lucide:circle-dot',
  'lucide:download',
  'lucide:clock-3',
  'lucide:triangle-alert',
  'lucide:rocket',
  'lucide:message-circle',
  'lucide:handshake',
  'lucide:grid-2x2',
  'lucide:wrench',
  'lucide:gamepad-2',
  'lucide:shield',
  'lucide:crosshair',
  'lucide:hammer',
  'lucide:pickaxe',
  'lucide:hexagon',
  'lucide:bomb',
  'lucide:sliders-horizontal',
  'lucide:briefcase-business',
  'lucide:box',
  'lucide:pin',
  'lucide:search-x'
];

const outDir = path.resolve('assets', 'icons');
await mkdir(outDir, { recursive: true });

for (const icon of icons) {
  const [set, name] = icon.split(':');
  const url = `https://api.iconify.design/${set}/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed: ${icon} (${res.status})`);
    continue;
  }

  const svg = await res.text();
  const outFile = path.join(outDir, `${name}.svg`);
  await writeFile(outFile, svg, 'utf8');
  console.log(`Saved ${outFile}`);
}

console.log('Done fetching icons.');
