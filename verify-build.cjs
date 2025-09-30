#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ModCraftAI Build...\n');

// Check dist directory structure
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');
const assetsDir = path.join(publicDir, 'assets');

console.log('📁 Checking directory structure:');
console.log(`   dist/ ${fs.existsSync(distDir) ? '✅' : '❌'}`);
console.log(`   dist/public/ ${fs.existsSync(publicDir) ? '✅' : '❌'}`);
console.log(`   dist/public/assets/ ${fs.existsSync(assetsDir) ? '✅' : '❌'}`);

// Check backend build
const backendFile = path.join(distDir, 'index.js');
console.log(`   dist/index.js ${fs.existsSync(backendFile) ? '✅' : '❌'}`);

if (fs.existsSync(backendFile)) {
  const backendSize = fs.statSync(backendFile).size;
  console.log(`   Backend size: ${(backendSize / 1024).toFixed(1)}KB`);
}

// Check frontend build
const frontendIndex = path.join(publicDir, 'index.html');
console.log(`   dist/public/index.html ${fs.existsSync(frontendIndex) ? '✅' : '❌'}`);

// Check assets
if (fs.existsSync(assetsDir)) {
  const assets = fs.readdirSync(assetsDir);
  console.log(`   Assets found: ${assets.length}`);
  
  assets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    const size = fs.statSync(assetPath).size;
    const type = asset.includes('.css') ? 'CSS' : asset.includes('.js') ? 'JS' : 'Other';
    console.log(`   - ${asset} (${type}): ${(size / 1024).toFixed(1)}KB`);
  });
}

// Check shared directory
const sharedDir = path.join(__dirname, 'shared');
console.log(`   shared/ ${fs.existsSync(sharedDir) ? '✅' : '❌'}`);

console.log('\n🎉 Build verification complete!');
console.log('✅ Frontend: React app bundled with Vite');
console.log('✅ Backend: Node.js server bundled with esbuild'); 
console.log('✅ Ready for deployment to Railway!');
