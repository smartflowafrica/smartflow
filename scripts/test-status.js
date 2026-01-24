// const fetch = require('node-fetch'); // Native fetch in Node 18+

// Config (Hardcoded for testing - REPLACE WITH YOUR ACTUAL VALUES)
const API_URL = 'http://localhost:8081'; // Default Evolution URL
const INSTANCE = 'SmartFlowMain'; // Your Instance Name
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe'; // Your API Key

async function testStatusPost() {
    console.log('Testing Send Media to DM...');

    const url = `${API_URL}/message/sendMedia/${INSTANCE}`;
    const targetNumber = '23491136244251'; // Target specific number (Found in logs)

    // Using Static Server on Port 3005
    const mediaUrl = "http://host.docker.internal:3005/1769211599027_images.jpg";

    const payload = {
        number: targetNumber,
        mediaMessage: {
            mediatype: 'image',
            media: mediaUrl,
            caption: 'Test DM from Script (Host URL Port 3005) 🚀'
        },
        options: { delay: 1200 }
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Body:', text);

    } catch (error) {
        console.error('Error:', error);
    }
}

testStatusPost();
