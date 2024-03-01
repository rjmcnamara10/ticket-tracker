const http = require('http');
const { collectTickets } = require('./index.js');

const server = http.createServer(async (req, res) => {
    if (req.url === '/tickets') {
        try {
            const tickets = await collectTickets();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(tickets));
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
