const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function verifyEndpoint(path) {
    console.log(`Testing endpoint: ${path}`);
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response: ${text.substring(0, 200)}...`); // Truncate
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function run() {
    await verifyEndpoint(`/instance/connect/${INSTANCE_NAME}`);
    await verifyEndpoint(`/instance/qrcode/base64/${INSTANCE_NAME}`);
    await verifyEndpoint(`/instance/qrcode/${INSTANCE_NAME}`);
}

run();
