const http = require('http');

const URL = 'http://172.17.0.1:3001/api/webhooks/whatsapp';

console.log(`\n🧪 Testing connectivity to Proxy at: ${URL}`);
console.log('---------------------------------------------------');

const req = http.request(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
}, (res) => {
    console.log(`✅ CONNECTION SUCCESSFUL!`);
    console.log(`   Status Code: ${res.statusCode}`);
    console.log(`   Message: Proxy is reachable from the Host.`);
    console.log(`\n👉 NOW CHECK PM2 LOGS: 'pm2 logs webhook-proxy'`);
    console.log(`   You should see "[Proxy] Incoming request..." there.`);
});

req.on('error', (e) => {
    console.error(`❌ CONNECTION FAILED: ${e.message}`);
    console.log('\nPossible causes:');
    console.log('1. Proxy is not running (Check pm2 status)');
    console.log('2. Firewall is blocking Port 3001');
    console.log('3. Wrong Docker Gateway IP');
});

req.on('timeout', () => {
    req.destroy();
    console.error('❌ CONNECTION TIMED OUT');
    console.log('Firewall is likely dropping the packets.');
});

req.write(JSON.stringify({ test: "connectivity_check" }));
req.end();
