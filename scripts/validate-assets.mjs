import fs from 'fs';
import path from 'path';

// Since we cannot easily import typescript modules containing jsx without ts-node,
// we will just do a simple regex or file existence check based on the directory structure.
const publicDir = path.join(process.cwd(), 'public', 'projects');

const expectedProjects = ['yqr', 'finance-os', 'dhara', 'studio-site'];
const expectedAssets = [
  'hero.webp',
  'overview.webp',
  'flow-discover.webp',
  'mobile.webp',
  'system-type.webp',
  'system-color.webp',
  'engineering.webp',
  'result.webp'
];

console.log('────────────────────────────────────────');
console.log(' ASSET VALIDATION REPORT');
console.log('────────────────────────────────────────');

expectedProjects.forEach(project => {
  const projPath = path.join(publicDir, project);
  let missing = [];
  
  if (!fs.existsSync(projPath)) {
    missing = expectedAssets;
  } else {
    expectedAssets.forEach(asset => {
      if (!fs.existsSync(path.join(projPath, asset))) {
        missing.push(asset);
      }
    });
  }

  if (missing.length > 0) {
    console.log(`\nMissing ${project.toUpperCase()} assets:`);
    missing.forEach(m => console.log(`  - ${m}`));
  } else {
    console.log(`\n✓ ${project.toUpperCase()} assets complete.`);
  }
});

console.log('\n────────────────────────────────────────');
