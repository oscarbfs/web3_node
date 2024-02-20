const authDB = require('../databases/local_databases/auth_database');
const userDB = require('../databases/local_databases/user_database');

function control(request, response, requestBody, queryParams, headers) {
    const data = requestBody ? JSON.parse(requestBody) : {};
    const token = headers['authorization'] ? headers['authorization'].split(' ')[1] : null;

    let result = {};

    if (request.method === 'POST' && request.url.includes('/auth/login')) {
        console.log(`Rodando login`);
        const user = userDB.verifyCredentials(data.email, data.password);
        result = authDB.login(user);
    
    } else if (request.method === 'DELETE' && request.url.includes('/auth/logout')) {
        console.log(`Rodando logout`);
        result = authDB.logout(token);
    
    } else if (request.method === 'GET' && request.url.includes('/auth/checkToken')) {
        console.log(`Rodando checkToken`);
        result = authDB.checkToken(token);
    
    } else {
        result = { 
            responseData: { error: "Rota não encontrada" },
            status: 404
        }
    }

    response.writeHead(result.status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(result.responseData));
}

module.exports = {
    control,
};
