const API_URL = 'http://localhost:8081';
const API_KEY = '44289315-9C0C-4318-825B-60C7E9A34567';

async function tryEndpoint(path) {
    try {
        console.log(`Trying GET ${path}...`);
        const response = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: { 'apikey': API_KEY }
        });

        if (!response.ok) {
            console.log(`Failed: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        console.log(`Success! Found data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
        return data;
    } catch (e) {
        console.log(`Error: ${e.message}`);
        return null;
    }
}

async function listInstances() {
    // Try known endpoints
    let data = await tryEndpoint('/instance/fetch');
    if (!data) data = await tryEndpoint('/instance/fetchInstances');
    if (!data) data = await tryEndpoint('/instances');

    if (data && Array.isArray(data)) {
        console.log(`\nFound ${data.length} instances:`);
        data.forEach(inst => {
            const i = inst.instance || inst; // Adapting to possible structures
            console.log(`- Name: ${i.instanceName || i.name} | Status: ${i.status || i.state || 'Unknown'} | Owner: ${i.owner || 'N/A'}`);
        });
    } else {
        console.log('\nCould not list instances. API might be different version or empty.');
    }
}

listInstances();
