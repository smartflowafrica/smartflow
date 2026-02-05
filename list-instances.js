const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';

async function listInstances() {
    try {
        console.log('Fetching all Evolution API instances...');

        const response = await fetch(`${API_URL}/instance/fetch`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log(`Found ${data.length} instances:`);

        data.forEach(inst => {
            console.log(`- Name: ${inst.instance.instanceName} | Status: ${inst.instance.status} | Owner: ${inst.instance.owner || 'N/A'}`);
        });

        if (data.length === 0) {
            console.log('No instances found! You may need to create one by scanning the QR code again.');
        }

    } catch (error) {
        console.error('Error listing instances:', error.message);
    }
}

listInstances();
