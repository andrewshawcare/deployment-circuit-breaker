import * as http from 'http';
import * as fs from 'fs';

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream('index.html').pipe(response);
});

server.listen(80);