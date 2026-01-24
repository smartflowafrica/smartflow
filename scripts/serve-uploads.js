const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.url}`);
    const filePath = path.join(UPLOADS_DIR, req.url.replace('/uploads/', ''));

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('File not found:', filePath);
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        console.log('Serving:', filePath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Static Server running on http://0.0.0.0:${PORT}`);
    console.log(`Serving: ${UPLOADS_DIR}`);
});
