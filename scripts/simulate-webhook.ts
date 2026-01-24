
async function main() {
    const payload = {
        type: "MESSAGES_UPSERT",
        data: {
            key: {
                remoteJid: "2348145523052@s.whatsapp.net",
                fromMe: false,
                id: "SIM_TS_001"
            },
            pushName: "Mark Simulation",
            message: {
                conversation: "Hello checking inbox visibility!"
            }
        }
    };

    try {
        const response = await fetch('http://localhost:3000/api/webhooks/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

    } catch (e) {
        console.error('Error:', e);
    }
}

main();
