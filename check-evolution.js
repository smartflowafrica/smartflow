
// Native fetch used in Node 18+

const SERVER_URL = "http://localhost:8081";
const API_KEY = "4L8bYQOswTIRKermAtGBNC13goy5MIRKe";

async function testConnection() {
    console.log(`Testing connection to ${SERVER_URL}...`);
    try {
        // Try to fetch instances (v1.8 /instance/fetchInstances)
        const response = await fetch(`${SERVER_URL}/instance/fetchInstances`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Connection Successful!');
            console.log('Instances:', JSON.stringify(data, null, 2));
        } else {
            console.error('Connection Failed!');
            console.error('Status:', response.status);
            console.error('Body:', await response.text());
        }
    } catch (error) {
        console.error('Network Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Ensure Evolution API is running on port 8081.');
        }
    }
}

testConnection();
