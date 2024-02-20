const userDB = require('../databases/local_databases/user_database');
const authDB = require('../databases/local_databases/auth_database');
const classDB = require('../databases/local_databases/class_database');

function control(request, response, requestBody, queryParams, headers) {
    const data = requestBody ? JSON.parse(requestBody) : {};
    const token = headers['authorization'] ? headers['authorization'].split(' ')[1] : null;
    const tokenData = authDB.getTokenData(token);

    let result = {};

    if (request.method === 'POST' && request.url.includes('/users/createUser')) {
        console.log(`Rodando createUser`);
        result = userDB.createUser(data);
    
    } else if( !tokenData.isValid ) {
        result = { 
            responseData: { error: "Token inválido" },
            status: 400
        }
    
    } else if (request.method === 'GET' && request.url.includes('/users/searchUsers')) {
        console.log(`Rodando searchUsers`);
        result = userDB.searchUsers(queryParams.name, queryParams.email);
    
    } else if (request.method === 'GET' && request.url.includes('/users/getUser')) {
        console.log(`Rodando getUser`);
        result = userDB.getUser(queryParams.id);
    
    } else if (request.method === 'GET' && request.url.includes('/users/getClassUsers')) {
        console.log(`Rodando getClassUsers`);
        const { creator_id, members_ids } = classDB.getClass(queryParams.class_id).responseData;
        result = userDB.getClassUsers(creator_id, members_ids);
    
    } else if (request.method === 'PUT' && request.url.includes('/users/updateUser')) {
        console.log(`Rodando updateUser`);
        result = userDB.updateUser(data, tokenData.user_id);
    
    } else if (request.method === 'DELETE' && request.url.includes('/users/deleteUser')) {
        console.log(`Rodando deleteUser`);
        authDB.logout(data.token)
        result = userDB.deleteUser(tokenData.user_id);
    
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
