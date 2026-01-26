const fs = require('fs');
const path = require('path');
const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function getQRCode() {
    console.log(`Fetching QR Code for: ${INSTANCE_NAME}...`);
    try {
        const response = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        const data = await response.json();
        console.log('Status:', response.status);

        if (data && data.base64) {
            console.log('QR Code received!');
            // Remove prefix data:image/png;base64,
            const base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

            const outputPath = path.join(__dirname, '../public/evolution_v2_qr.png');
            fs.writeFileSync(outputPath, base64Data, 'base64');
            console.log(`QR Code saved to: ${outputPath}`);
        } else {
            console.log('No QR Code in response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

getQRCode();
