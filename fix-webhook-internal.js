const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';
const INTERNAL_WEBHOOK_URL = 'http://172.17.0.1:3000/api/webhooks/whatsapp';

async function tryEndpoint(path) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: { 'apikey': API_KEY }
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
}

async function setWebhook() {
    try {
        console.log('Finding active instance...');

        // Try to find instances
        let instances = await tryEndpoint('/instance/fetchInstances');
        if (!instances) instances = await tryEndpoint('/instance/fetch');

        if (!instances || !Array.isArray(instances) || instances.length === 0) {
            console.error('❌ NO INSTANCES FOUND!');
            console.error('👉 Please go to your App, disconnect/reconnect, and SCAN the QR code first.');
            return;
        }

        // Get the first instance
        const first = instances[0];
        const instanceName = first.instance?.instanceName || first.name || first.instanceName;

        if (!instanceName) {
            console.error('❌ Could not parse instance name from response:', JSON.stringify(first));
            return;
        }

        console.log(`✅ Found Instance: ${instanceName}`);
        console.log(`Setting INTERNAL webhook to: ${INTERNAL_WEBHOOK_URL}...`);

        const response = await fetch(`${API_URL}/webhook/set/${instanceName}`, {
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
        console.log('🎉 Webhook Set Successfully:', JSON.stringify(data, null, 2));
        console.log('\n👉 Now send a test message from your phone. It should work instantly!');

    } catch (error) {
        console.error('Error setting webhook:', error.message);
    }
}

setWebhook();
