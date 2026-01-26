const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';

async function checkStatus() {
    console.log('Checking Evolution API Status...');
    try {
        const response = await fetch(`${API_URL}/instance/fetchInstances`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        console.log('Status Code:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkStatus();
