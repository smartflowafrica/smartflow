const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';
const INTERNAL_WEBHOOK_URL = 'http://172.18.0.1:3001/api/webhooks/whatsapp';

async function tryEndpoint(path) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: { 'apikey': API_KEY }
        });
        if (!response.ok) {
            console.log(`⚠️ Endpoint ${path} returned ${response.status} ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (e) {
        console.error(`❌ Connection Error to ${API_URL}${path}:`, e.message);
        return null;
    }
}

async function setWebhook() {
    try {
        console.log('Finding active instance...');

        // Try to find instances
        let instances = await tryEndpoint('/instance/fetchInstances');
        if (!instances || instances.length === 0) instances = await tryEndpoint('/instance/fetch');

        // FALLBACK: Check for the specific instance we saw in logs
        if (!instances || !Array.isArray(instances) || instances.length === 0) {
            console.log('⚠️ No instances in list. Checking for known instance "client_cmjljfn5a00028oay4dfj4o4e_v2"...');
            const specific = await tryEndpoint('/instance/fetch/client_cmjljfn5a00028oay4dfj4o4e_v2');
            if (specific && (specific.instance || specific.name)) {
                instances = [specific];
            }
        }

        if (!instances || !Array.isArray(instances) || instances.length === 0) {
            console.error('❌ NO INSTANCES FOUND!');
            console.error('👉 The API database might have been reset or is not loading the old volume.');
            console.error('👉 Please go to your URL: http://smartflowafrica.com:8081');
            console.error('👉 Create a new instance named "SmartFlowMain" and SCAN the QR code.');
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
        // Wrap payload in 'webhook' property as per v2 validation
        const payload = {
            webhook: {
                enabled: true,
                url: INTERNAL_WEBHOOK_URL,
                webhookByEvents: false,
                events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
            }
        };

        console.log(`Setting INTERNAL webhook to: ${INTERNAL_WEBHOOK_URL}...`);

        const response = await fetch(`${API_URL}/webhook/set/${instanceName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log('🎉 Webhook Set Successfully:', JSON.stringify(data, null, 2));

        // CHECK CONNECTION STATE
        console.log('\n🔍 Checking Connection State...');
        const state = await tryEndpoint(`/instance/connectionState/${instanceName}`);
        console.log('📊 Connection State:', JSON.stringify(state, null, 2));

        if (state?.state === 'open') {
            console.log('\n✅ Instance is CONNECTED and READY!');
            console.log('👉 Send "Test 7" from your phone now. It should appear in the App.');
        } else {
            console.log('\n⚠️ Instance is NOT `open` (Request returned: ' + (state?.state || 'unknown') + ')');
            console.log('👉 Please wait a moment or scan the QR code again if needed.');
        }

    } catch (error) {
        console.error('Error setting webhook:', error.message);
    }
}

setWebhook();
