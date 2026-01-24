// Native fetch in Node 18+

async function testWebhook() {
    const payload = {
        type: "MESSAGES_UPSERT",
        data: {
            key: {
                remoteJid: "2348145523052@s.whatsapp.net",
                fromMe: false,
                id: "TEST_MSG_" + Date.now()
            },
            pushName: "Mark Test",
            message: {
                conversation: "I want to book an appointment"
            }
        }
    };

    console.log('Sending Webhook Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch('http://localhost:3000/api/webhooks/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Response Status:', response.status);
        const text = await response.text();
        console.log('Response Body:', text);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testWebhook();
