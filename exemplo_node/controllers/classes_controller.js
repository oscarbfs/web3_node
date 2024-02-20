const classDB = require('../databases/local_databases/class_database');
const authDB = require('../databases/local_databases/auth_database');
const userDB = require('../databases/local_databases/user_database');

function control(request, response, requestBody, queryParams, headers) {
    const data = requestBody ? JSON.parse(requestBody) : {};
    const token = headers['authorization'] ? headers['authorization'].split(' ')[1] : null;
    const tokenData = authDB.getTokenData(token);

    let result = {};

    if( !tokenData.isValid ) {
        result = { 
            responseData: { error: "Token inválido" },
            status: 400
        }
    
    } else if (request.method === 'GET' && request.url.includes('/classes/searchClasses')) {
        console.log(`Rodando searchClasses`);
        result = classDB.searchClasses(queryParams.name, queryParams.discipline, queryParams.section, queryParams.room, tokenData.user_id);

        if(result.status === 200) {
            result.responseData = result.responseData.map(cls => {
                const creator = userDB.getUser(cls.creator_id).responseData;
                delete cls.creator_id;
                return { ...cls, creator };
            });
        }
    
    } else if (request.method === 'GET' && request.url.includes('/classes/getClass')) {
        console.log(`Rodando getClass`);
        result = classDB.getClass(queryParams.id, tokenData.user_id);
        
        if(result.status === 200) {
            const creator = userDB.getUser(result.responseData.creator_id).responseData;
            result.responseData = { ...result.responseData, creator };
            delete result.responseData.creator_id;
        }
    
    } else if (request.method === 'POST' && request.url.includes('/classes/joinClass')) {
        console.log(`Rodando joinClass`);
        result = classDB.joinClass(data, tokenData.user_id);

    } else if (request.method === 'POST' && request.url.includes('/classes/createClass')) {
        console.log(`Rodando createClass`);
        result = classDB.createClass(data, tokenData.user_id);
    
    } else if (request.method === 'PUT' && request.url.includes('/classes/updateClass')) {
        console.log(`Rodando updateClass`);
        result = classDB.updateClass(data, tokenData.user_id);
    
    } else if (request.method === 'DELETE' && request.url.includes('/classes/deleteClass')) {
        console.log(`Rodando deleteClass`);
        result = classDB.deleteClass(data, tokenData.user_id);

    } else if (request.method === 'DELETE' && request.url.includes('/classes/leaveClass')) {
        console.log(`Rodando leaveClass`);
        result = classDB.leaveClass(data, tokenData.user_id);
    
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
