let users = [];
let userIdCounter = 1;

function createUser(userData) {
    try {
        if (searchUsers(null, userData.email).responseData.length > 0) {
            return { responseData: { error: `Email já em uso.` }, status: 400 };
        } else if (!userData.name) {
            return { responseData: { error: "O nome (name) do usuário é obrigatório." }, status: 400 };
        } else if (!userData.email) {
            return { responseData: { error: "O email (email) do usuário é obrigatório." }, status: 400 };
        } else if (!userData.password) {
            return { responseData: { error: "A senha (password) do usuário é obrigatória." }, status: 400 };
        }

        const user = {
            id: (userIdCounter++).toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            created_at: new Date().toISOString(),
            updated_at: null,
        }

        users.push(user);
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return { responseData: userWithoutPassword, status: 201 };
    } catch (error) {
        return { responseData: { error: `Falha ao criar usuário. ${error}`}, status: 400 };
    }
}

function getUser(id) {
    try {
        const foundUser = users.find(user => user.id === id);
        
        if (foundUser) {
            const userWithoutPassword = { ...foundUser };
            delete userWithoutPassword.password;
            return { responseData: userWithoutPassword, status: 200 };
        } else {
            return { responseData: { error: `Usuário não encontrado.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Falha ao buscar usuário. ${error}`}, status: 400 };
    }
}

function getClassUsers(creator_id, members_ids) {
    try {
        const classUsers = users.filter(user => user.id === creator_id || members_ids.includes(user.id));
        const usersWithoutPassword = classUsers.map(user => {
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            return userWithoutPassword;
        });
        return { responseData: usersWithoutPassword, status: 200 };
    } catch (error) {
        return { responseData: { error: `Erro ao buscar usuários da turma. ${error}` }, status: 400 };
    }
    
}

function searchUsers(name, email) {
    try {
        const foundUsers = users.filter(user =>
            (!name || user.name === name) &&
            (!email || user.email === email)
        );
        const usersWithoutPassword = foundUsers.map(user => {
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            return userWithoutPassword;
        });
        return { responseData: usersWithoutPassword, status: 200 };
    } catch (error) {
        return { responseData: { error: `Erro ao buscar usuários. ${error}` }, status: 400 };
    }
}

function updateUser(userData, user_id) {
    try {

        const index = users.findIndex(c => c.id === user_id);
        
        if (index !== -1) {
            users[index] = {
                id: users[index].id,
                name: userData.name ?? users[index].name,
                email: userData.email ?? users[index].email,
                password: userData.password ?? users[index].password,
                created_at: users[index].created_at,
                updated_at: new Date().toISOString(),
            };
            const updatedUserWithoutPassword = { ...users[index] };
            delete updatedUserWithoutPassword.password;
            return { responseData: updatedUserWithoutPassword, status: 200 };
        } else {
            return { responseData: { error: `Usuário não encontrado.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao atualizar usuário. ${error}` }, status: 400 };
    }
}

function deleteUser(user_id) {
    try {

        const index = users.findIndex(c => c.id === user_id);
        
        if (index !== -1) {
            users.splice(index, 1);
            return { responseData: { message: 'Usuário deletado com sucesso' }, status: 200 };
        } else {
            return { responseData: { error: `Usuário não encontrado.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao deletar usuário. ${error}` }, status: 400 };
    }
}

function verifyCredentials(email, password) {
    if(email && password) {
        const user = users.find(user => user.email === email && user.password === password);
        return user;
    } else {
        return null;
    }
}

module.exports = {
    createUser,
    searchUsers,
    getUser,
    getClassUsers,
    updateUser,
    deleteUser,
    verifyCredentials,
};
