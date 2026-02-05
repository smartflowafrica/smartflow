// This script sets the webhook to use the internal Docker host IP
// Use this if Evolution API cannot reach https://smartflowafrica.com from inside Docker

const INSTANCE_NAME = 'client_cmjljfn5a00028oay4dfj4o4e_v2';
const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';

// Internal Docker host IP - this is the default gateway for containers on Linux
// Port 3000 is where Next.js runs (adjust if different)
const INTERNAL_WEBHOOK_URL = 'http://172.17.0.1:3000/api/webhooks/whatsapp';

async function setWebhook() {
    try {
        console.log(`Setting INTERNAL webhook for instance: ${INSTANCE_NAME}...`);
        console.log(`Webhook URL: ${INTERNAL_WEBHOOK_URL}`);

        const response = await fetch(`${API_URL}/webhook/set/${INSTANCE_NAME}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({
                enabled: true,
                url: INTERNAL_WEBHOOK_URL,
                webhookByEvents: false,
                events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Webhook Set Successfully:', JSON.stringify(data, null, 2));
        console.log('\nNow send a test message from your phone to verify!');

    } catch (error) {
        console.error('Error setting webhook:', error.message);
    }
}

setWebhook();
