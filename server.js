// Import modules
const EXPRESS = require('express');
const { v4: UUID4 } = require('uuid');
const FS = require('fs').promises;

const APP = EXPRESS();

const SERVER = HTTP.createServer((request, response) => {
    const STATUS_MATCH = request.url.match(/^\/status\/\d{3}$/g) ?
        request.url.match(/^\/status\/\d{3}$/g)[0] :
        null;
    const DELAY_MATCH = request.url.match(/^\/delay\/\d+$/g) ?
        request.url.match(/^\/delay\/\d+$/g)[0] :
        null;

    switch(request.url) {
        case '/html':
        case '/':
            FS.readFile('./data/index.html', 'utf8')
                .then((sentBack) => {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(sentBack);
                })
                .catch((error) => {
                    console.log(error);
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end('<h1>Error 404: File not found<h1>');
                });
            break;
        case '/json':
            FS.readFile('./data/response.json', 'utf8')
                .then((sentBack) => {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(sentBack);
                })
                .catch((error) => {
                    console.log(error);
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end('<h1>Error 404: File not found<h1>');
                });
            break;
        case '/uuid':
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ uuid: UUID4() }))
            break;
        case STATUS_MATCH:
            response.writeHead(parseInt(request.url.match(/\d{3}$/g)[0]), { 'Content-Type': 'text/html' });
            response.end(`<h1>Status Code: ${request.url.match(/\d{3}$/g)[0]}<h1>`);
            break;
        case DELAY_MATCH:
            setTimeout(() => {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(`<h1>Server responded after ${request.url.match(/\d+$/g)[0]} seconds<h1>`);
            }, parseInt(request.url.match(/\d+$/g)[0]) * 1000)
            break;
        default:
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('<h1>Error 404: File not found<h1>');
    }
});

const PORT = 3000;

SERVER.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});