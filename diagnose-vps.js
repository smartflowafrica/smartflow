const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- VPS DIAGNOSTICS ---\n');

// 1. Check Port 3000 binding
console.log('1. Checking Port 3000 Binding (Next.js):');
try {
    const netstat = execSync('netstat -tlpn | grep 3000').toString();
    console.log(netstat.trim() || '❌ No service found on port 3000!');

    if (netstat.includes('127.0.0.1:3000') && !netstat.includes(':::3000') && !netstat.includes('0.0.0.0:3000')) {
        console.log('\n⚠️ WARNING: App is listening on LOCALHOST ONLY (127.0.0.1). Docker cannot reach it!');
    } else {
        console.log('✅ Port binding looks accessible (0.0.0.0 or :::)');
    }
} catch (e) {
    console.log('❌ Failed to run netstat (command might be missing)');
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
