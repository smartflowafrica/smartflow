const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function resetInstance() {
    console.log(`Deleting Instance: ${INSTANCE_NAME}...`);
    try {
        await fetch(`${API_URL}/instance/delete/${INSTANCE_NAME}`, {
            method: 'DELETE',
            headers: { 'apikey': API_KEY }
        });
        console.log('Instance deleted.');
    } catch (e) {
        console.log('Delete failed (might not exist):', e.message);
    }

    // Wait a bit
    await new Promise(pkg => setTimeout(pkg, 2000));

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
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS'
            })
        });

        const data = await response.json();
        console.log('Create Response:', JSON.stringify(data, null, 2));

        if (data.qrcode && data.qrcode.base64) {
            const fs = require('fs');
            const path = require('path');
            const base64Data = data.qrcode.base64.replace(/^data:image\/png;base64,/, "");
            const outputPath = path.join(__dirname, '../public/evolution_v2_qr.png');
            fs.writeFileSync(outputPath, base64Data, 'base64');
            console.log(`QR Code saved to: ${outputPath}`);
        } else {
            console.log('No QR in create response, trying connect...');
            // Try connect
            const connectRes = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
                method: 'GET',
                headers: { 'apikey': API_KEY }
            });
            const connectData = await connectRes.json();
            console.log('Connect Response:', JSON.stringify(connectData, null, 2));
            if (connectData.base64) {
                const fs = require('fs');
                const path = require('path');
                const base64Data = connectData.base64.replace(/^data:image\/png;base64,/, "");
                const outputPath = path.join(__dirname, '../public/evolution_v2_qr.png');
                fs.writeFileSync(outputPath, base64Data, 'base64');
                console.log(`QR Code saved to: ${outputPath}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

resetInstance();
