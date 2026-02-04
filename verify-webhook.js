const INSTANCE_NAME = 'client_cmjljfn5a00028oay4dfj4o4e_v2'; // The one from your logs
const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';

async function checkWebhook() {
    try {
        console.log(`Checking webhook for instance: ${INSTANCE_NAME}...`);

        const response = await fetch(`${API_URL}/webhook/find/${INSTANCE_NAME}`, {
            headers: {
                'apikey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Webhook Configuration:');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error fetching webhook:', error.message);
    }
}

checkWebhook();
