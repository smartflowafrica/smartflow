const http = require('http');

// CONFIG
const PROXY_PORT = 3001;
const APP_PORT = 3006;
const INSTANCE_ID = 'ce19b768-d033-4175-95a4-f38d2a4234d8';
const REMOTE_JID = '2348099999999@s.whatsapp.net';

const payload = {
    "type": "MESSAGES_UPSERT",
    "instanceId": INSTANCE_ID,
    "data": {
        "key": { "remoteJid": REMOTE_JID, "fromMe": false, "id": "SIM_" + Date.now() },
        "pushName": "Simulated User",
        "message": { "conversation": "Simulated Test Message" },
        "messageType": "conversation",
        "messageTimestamp": Math.floor(Date.now() / 1000),
        "owner": INSTANCE_ID,
        "source": "ios"
    },
    "sender": REMOTE_JID
};

function send(host, port, path, label) {
    console.log(`\nTesting ${label}: http://${host}:${port}${path}`);
    const req = http.request({
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(payload))
        }
    }, (res) => {
        console.log(`   [${label}] STATUS: ${res.statusCode}`);
        if (res.statusCode !== 404) {
            res.setEncoding('utf8');
            res.on('data', d => console.log(`   [${label}] BODY: ${d}`));
        }
    });
    req.on('error', (e) => console.log(`   [${label}] ERROR: ${e.message}`));
    req.write(JSON.stringify(payload));
    req.end();
}

console.log('--- STARTING SIMULATION ---');

// 1. Test Proxy (Normal Flow)
send('127.0.0.1', PROXY_PORT, '/api/webhooks/whatsapp', 'Proxy Standard');

// 2. Test Proxy (Base Path Variation)
send('127.0.0.1', PROXY_PORT, '/webhooks/whatsapp', 'Proxy No-API prefix');

// 3. Test App Direct (Bypassing Proxy)
send('127.0.0.1', APP_PORT, '/api/webhooks/whatsapp', 'Direct to App (Port 4000)');
