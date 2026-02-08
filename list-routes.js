const fs = require('fs');
const path = require('path');

const APP_DIR = './.next/server/app';

function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    files.forEach(f => {
        const fullPath = path.join(dir, f);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scan(fullPath);
        } else if (f.endsWith('route.js')) {
            console.log('✅ Found Route:', fullPath);
        }
    });
}

console.log('Scanning for compiled routes in .next/server/app ...');
scan(APP_DIR);
console.log('Done.');
