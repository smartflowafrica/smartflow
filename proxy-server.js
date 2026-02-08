const http = require('http');
const fs = require('fs');
const path = require('path');

const SOURCE_PORT = 3001; // Listen on all interfaces (0.0.0.0)
const TARGET_PORT = 3006; // Confirmed via startup logs // Forward to localhost (127.0.0.1)
const TARGET_HOST = '127.0.0.1';

// File logger function
function logToFile(message) {
    const logPath = path.join(__dirname, 'proxy.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

const server = http.createServer((clientReq, clientRes) => {
    const options = {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers
    };

    // Forward request to target
    const logMsg = `[Proxy] Incoming request: ${clientReq.method} ${clientReq.url}`;
    console.log(logMsg);
    logToFile(logMsg);

    // Capture body for POST requests (simple buffer concat)
    if (clientReq.method === 'POST') {
        let body = [];
        clientReq.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const bodyStr = Buffer.concat(body).toString();
            logToFile(`[Body Preview]: ${bodyStr.substring(0, 500)}`);
            // We need to create a new stream or re-emit for proxyReq if we consume it here
            // BUT: http.request pipes efficiently. If we consume 'data' events, we break the pipe to proxyReq unless we pause/resume or shadow.
            // EASIER APPROACH for debug: Just verify connection first.
        });
    }

    const proxyReq = http.request(options, (proxyRes) => {
        const statusMsg = `[Proxy] Target replied: ${proxyRes.statusCode}`;
        console.log(statusMsg);
        logToFile(statusMsg);

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
