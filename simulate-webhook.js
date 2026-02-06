const http = require('http');

// CONFIG
const PROXY_PORT = 3001;
const PATH = '/api/webhooks/whatsapp';
const INSTANCE_ID = 'ce19b768-d033-4175-95a4-f38d2a4234d8'; // The ID we just put in DB
const REMOTE_JID = '2348099999999@s.whatsapp.net'; // Dummy sender

const payload = {
    "type": "MESSAGES_UPSERT",
    "instanceId": INSTANCE_ID,
    "data": {
        "key": {
            "remoteJid": REMOTE_JID,
            "fromMe": false,
            "id": "SIMULATED_" + Date.now()
        },
        "pushName": "Simulated User",
        "message": {
            "conversation": "Simulated Test Message"
        },
        "messageType": "conversation",
        "messageTimestamp": Math.floor(Date.now() / 1000),
        "owner": INSTANCE_ID,
        "source": "ios"
    },
    "destination": "https://smartflowafrica.com/api/webhooks/whatsapp",
    "date_time": new Date().toISOString(),
    "sender": REMOTE_JID,
    "server_url": "http://localhost:8081",
    "apikey": "test-api-key"
};

console.log(`\n🚀 Sending Simulated Webhook to Port ${PROXY_PORT}...`);
console.log(`Payload Instance ID: ${INSTANCE_ID}`);

const req = http.request({
    host: '127.0.0.1',
    port: PROXY_PORT,
    path: PATH,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    }
}, (res) => {
    console.log(`\n✅ STATUS: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers));

    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('\n🎉 SUCCESS! The App accepted the message.');
            console.log('Check your Team Inbox for "Simulated Test Message" from +2348099999999.');
        } else {
            console.log('\n❌ FAILED. The App rejected the message.');
        }
    });
});

req.on('error', (e) => {
    console.error(`\n❌ REQUEST ERROR: ${e.message}`);
});

req.write(JSON.stringify(payload));
req.end();
