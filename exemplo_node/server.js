const http = require('http');
const url = require('url');
const authController = require('./controllers/auth_controller');
const userController = require('./controllers/users_controller');
const classController = require('./controllers/classes_controller');

const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
        return;
    }

    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    let requestBody = '';

    request.on('data', (chunk) => {
        requestBody += chunk.toString();
    });

    request.on('end', () => {
        const headers = request.headers;

        if (pathname.includes('/auth')) {
            authController.control(request, response, requestBody, parsedUrl.query, headers);

        } else if (pathname.includes('/users')) {
            userController.control(request, response, requestBody, parsedUrl.query, headers);

        } else if (pathname.includes('/classes')) {
            classController.control(request, response, requestBody, parsedUrl.query, headers);

        } else if (pathname === '/') {
            response.writeHead(200);
            response.end('Bem-vindo ao exemplo de backend do Curso de Node.js');

        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
