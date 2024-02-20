let tokensById = {};

function login(user) {

    if (user) {
        tokensById[user.id] = generateAuthToken();

        return { responseData: { token: tokensById[user.id] }, status: 200 };
    } else {
        return { responseData: { error: `Credenciais inválidas.` }, status: 400 };
    }
}

function logout(token) {

    const { isValid, user_id } = getTokenData(token);
    if (isValid) {
        delete tokensById[user_id];

        return { responseData: { message: 'Logout bem-sucedido' }, status: 200 };
    } else {
        return { responseData: { error: `Token inválido.` }, status: 400 };
    }
}

function checkToken(token) {

    const tokenData = getTokenData(token);
    
    if( tokenData.isValid ) {
        return { responseData: tokenData, status: 200 };
    } else {
        return { responseData: { isValid: false }, status: 400 };
    }
}

function generateAuthToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getTokenData(token) {
    return {
        isValid: Object.values(tokensById).includes(token),
        user_id: Object.keys(tokensById).find(key => tokensById[key] === token)
    }
}

module.exports = {
    login,
    logout,
    checkToken,
    getTokenData,
};
