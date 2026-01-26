const API_URL = 'http://localhost:8081';
const API_KEY = '4L8bYQOswTIRKermAtGBNC13goy5MIRKe';
const INSTANCE_NAME = 'SmartFlowMain';

async function logoutInstance() {
    console.log(`Logging out Instance: ${INSTANCE_NAME}...`);
    try {
        const response = await fetch(`${API_URL}/instance/logout/${INSTANCE_NAME}`, {
            method: 'DELETE',
            headers: {
                'apikey': API_KEY
            }
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

logoutInstance();
