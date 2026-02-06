const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- VPS DIAGNOSTICS ---\n');

// 1. Check ALL Port Bindings
console.log('1. Scan Listening Ports (TCP):');
try {
    const netstat = execSync('netstat -tlpn').toString();
    console.log(netstat);
} catch (e) {
    console.log('❌ Failed to run netstat');
}

console.log('\n----------------------------------------\n');

// 2. Check Docker Host IP
console.log('2. Checking Docker Interface (docker0):');
try {
    const ip = execSync('ip addr show docker0 | grep inet').toString();
    console.log(ip.trim());
} catch (e) {
    console.log('⚠️ Could not find docker0 interface. Is Docker running?');
}

console.log('\n----------------------------------------\n');

// 3. Check Webhook Logs
console.log('3. Checking webhook_payloads.log:');
if (fs.existsSync('webhook_payloads.log')) {
    const stats = fs.statSync('webhook_payloads.log');
    console.log(`✅ File Exists! Size: ${stats.size} bytes`);
    if (stats.size > 0) {
        console.log('\n--- LAST 20 LINES ---');
        try {
            console.log(execSync('tail -n 20 webhook_payloads.log').toString());
        } catch (e) { console.log('Error reading file'); }
    } else {
        console.log('⚠️ File is EMPTY. No requests received yet.');
    }
} else {
    console.log('❌ webhook_payloads.log does NOT exist. No requests received yet.');
}

console.log('\n--- END DIAGNOSTICS ---');
