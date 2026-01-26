const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function createInstance() {
    console.log(`Creating Instance: ${INSTANCE_NAME}...`);
    try {
        const response = await fetch(`${API_URL}/instance/create`, {
            method: 'POST',
            headers: {
                'apikey': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instanceName: INSTANCE_NAME,
                token: '', // Optional token
                qrcode: true, // Return QR immediately if possible
                integration: 'WHATSAPP-BAILEYS'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createInstance();
