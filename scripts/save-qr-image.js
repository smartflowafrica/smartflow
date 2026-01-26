const fs = require('fs');
const path = require('path');
// fetch is native in Node 18+

const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function saveQR() {
    console.log(`Fetching Code for: ${INSTANCE_NAME}...`);
    try {
        const response = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
            method: 'GET',
            headers: { 'apikey': API_KEY }
        });

        const data = await response.json();

        if (data && data.code) {
            console.log('Raw Code received!');
            const qrData = encodeURIComponent(data.code);
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;

            console.log('Downloading QR Image from:', qrImageUrl);
            const imgRes = await fetch(qrImageUrl);
            const buffer = await imgRes.arrayBuffer();

            const outputPath = path.join(__dirname, '../public/evolution_v2_qr.png');
            fs.writeFileSync(outputPath, Buffer.from(buffer));
            console.log(`QR Code Image saved to: ${outputPath}`);
        } else {
            console.log('No Code in response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

saveQR();
