// Native fetch is available in Node 18+
// const fetch = require('node-fetch');

const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe'; // From docker-compose
const INSTANCE_NAME = 'SmartFlowMain'; // Or 'client_CLIENTID_v2'

async function debugEvolution() {
    console.log('--- Debugging Evolution API V2 ---');
    console.log(`URL: ${API_URL}`);
    console.log(`Instance: ${INSTANCE_NAME}`);

    // 1. Check Version / Health
    try {
        // Evolution v2 might not have a simple /version endpoint, but let's try fetchInstances to see if it responds
        console.log('\n1. Fetching Instances (GET /instance/fetchInstances)...');
        const res = await fetch(`${API_URL}/instance/fetchInstances`, {
            headers: { 'apikey': API_KEY }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text.substring(0, 500)}`); // Truncate if long
    } catch (e) {
        console.error('Fetch Instances Failed:', e.message);
    }

    // 2. Check Connection State
    try {
        console.log(`\n2. Checking Connection State (GET /instance/connectionState/${INSTANCE_NAME})...`);
        const res = await fetch(`${API_URL}/instance/connectionState/${INSTANCE_NAME}`, {
            headers: { 'apikey': API_KEY }
        });
        console.log(`Status: ${res.status}`);
        console.log(`Body: ${await res.text()}`);
    } catch (e) {
        console.error('Connection State Failed:', e.message);
    }

    // 3. Try Connect (QR Code)
    try {
        console.log(`\n3. Requesting Connection/QR (GET /instance/connect/${INSTANCE_NAME})...`);
        const res = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
            headers: { 'apikey': API_KEY }
        });
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body Preview: ${text.substring(0, 200)}...`);

        try {
            const json = JSON.parse(text);
            if (json.base64) console.log('✅ QR Code (base64) found in root object');
            if (json.qrcode?.base64) console.log('✅ QR Code (base64) found in nested [qrcode] object (v2 style)');
            if (json.instance?.state === 'open') console.log('✅ Instance is ALREADY CONNECTED');
        } catch (e) {
            console.log('Response is not JSON or invalid');
        }

    } catch (e) {
        console.error('Connect Failed:', e.message);
    }
}

debugEvolution();
