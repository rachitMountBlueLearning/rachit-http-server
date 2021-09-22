// Import modules
const EXPRESS = require('express');
const { v4: UUID4 } = require('uuid');
const FS = require('fs').promises;


const APP = EXPRESS();

APP.get('/html', (request, response) => {
    response
        .status(200)
        .sendFile(__dirname + '/data/index.html');
});
APP.get('/json', (request, response) => {
    response
        .status(200)
        .sendFile(__dirname + '/data/response.json');
});
APP.get('/uuid', (request, response) => {
    response
        .status(200)
        .json({ uuid: UUID4() });
});
APP.get('/status/:statusCode', (request, response) => {
    if(request.params.statusCode.match(/^\d{3}$/)) {
        response
            .status(parseInt(request.params.statusCode))
            .send(`<h1>Status Code: ${request.params.statusCode}<h1>`);
    } else {
        response
            .status(404)
            .send('<h1>Error 404: File not found<h1>');
    }
});
APP.get('/delay/:delayTime', (request, response) => {
    if(request.params.delayTime.match(/^\d+$/)) {
        setTimeout(() => {
            response
                .status(200)
                .send(`<h1>Server responded after ${request.params.delayTime} seconds<h1>`);
        }, parseInt(request.params.delayTime) * 1000);
    } else {
        response
            .status(404)
            .send('<h1>Error 404: File not found<h1>');
    }
});
APP.get('*', (request, response) => {
    response
        .status(404)
        .send('<h1>Error 404: File not found<h1>');
});

const PORT = process.env.PORT || 3000;

APP.listen(PORT, () => {
    console.log(`Server started.\nListening on port ${PORT}`);
});