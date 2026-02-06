const http = require('http');

const SOURCE_PORT = 3001; // Listen on all interfaces (0.0.0.0)
const TARGET_PORT = 3000; // Forward to localhost (127.0.0.1)
const TARGET_HOST = '127.0.0.1';

const server = http.createServer((clientReq, clientRes) => {
    const options = {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers
    };

    // Forward request to target
    console.log(`[Proxy] Incoming request: ${clientReq.method} ${clientReq.url}`);
    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
    });

    proxyReq.on('error', (e) => {
        console.error(`Proxy Error: ${e.message}`);
        clientRes.writeHead(502);
        clientRes.end('Bad Gateway: Could not reach Next.js app on port 3000');
    });

    // Pipe client data to target
    clientReq.pipe(proxyReq, { end: true });
});

server.listen(SOURCE_PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Webhook Proxy Running!`);
    console.log(`   Listening on: 0.0.0.0:${SOURCE_PORT}`);
    console.log(`   Forwarding to: ${TARGET_HOST}:${TARGET_PORT}`);
    console.log(`   Docker containers can now reach this machine via 172.17.0.1:${SOURCE_PORT}\n`);
    console.log('--- Keep this script running to receive webhooks! ---\n');
});
