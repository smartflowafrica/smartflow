const INSTANCE_NAME = 'client_cmjljfn5a00028oay4dfj4o4e_v2'; // Your specific instance
const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';

async function setWebhook() {
    try {
        console.log(`Setting webhook for instance: ${INSTANCE_NAME}...`);

        const response = await fetch(`${API_URL}/webhook/set/${INSTANCE_NAME}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({
                enabled: true,
                url: 'https://smartflowafrica.com/api/webhooks/whatsapp',
                webhookByEvents: false,
                events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Webhook Set Successfully:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error setting webhook:', error.message);
    }
}

setWebhook();
