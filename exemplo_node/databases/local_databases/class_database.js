let classes = [];
let classIdCounter = 1;

function createClass(classData, creator_id) {
    try {
        if (!classData.name) {
            return { responseData: { error: "O nome da turma é obrigatório." }, status: 400 };
        } 

        const cls = {
            id: (classIdCounter++).toString(),
            creator_id: creator_id,
            name: classData.name,
            section: classData.section,
            discipline: classData.discipline,
            room: classData.room,
            members_ids: [],
            created_at: new Date().toISOString(),
            updated_at: null,
        }

        classes.push(cls);
        return { responseData: cls, status: 201 };
    } catch (error) {
        return { responseData: { error: `Falha ao criar turma. ${error}`}, status: 400 };
    }
}

function getClass(id, user_id) {
    try {
        const foundClass = classes.find(cls => cls.id === id && (cls.creator_id === user_id || cls.members_ids.includes(user_id)));
        return foundClass 
            ? { responseData: foundClass, status: 200 } 
            : { responseData: { error: `Turma não encontrada ou você não tem permissão.` }, status: 404 };
    } catch (error) {
        return { responseData: { error: `Falha ao buscar turma. ${error}` }, status: 400 };
    }
}

function searchClasses(name, discipline, section, room, user_id) {
    try {
        const foundClasses = classes.filter(cls =>
            (!name || cls.name === name) &&
            (!discipline || cls.discipline === discipline) &&
            (!section || cls.section === section) &&
            (!room || cls.room === room) &&
            (cls.creator_id === user_id || cls.members_ids.includes(user_id))
        );
        const classesLite = foundClasses.map(cls => {
            const clsLite = { ...cls };
            delete clsLite.members_ids;
            return clsLite;
        });

        return { responseData: classesLite, status: 200 };
    } catch (error) {
        return { responseData: { error: `Erro ao buscar turmas. ${error}` }, status: 400 };
    }
}

function updateClass(classData, user_id) {
    try {
        if (!classData.id) {
            return { responseData: { error: "O ID (id) da turma é obrigatório" }, status: 400 };
        }

        const index = classes.findIndex(cls => cls.id === classData.id);
        
        if (index !== -1 && classes[index].creator_id === user_id) {
            classes[index] = {
                id: classes[index].id,
                creator_id: classes[index].creator_id,
                name: classData.name ?? classes[index].name ,
                section: classData.section ?? classes[index].section ,
                discipline: classData.discipline ?? classes[index].discipline ,
                room: classData.room ?? classes[index].room ,
                members_ids: classes[index].members_ids,
                created_at: classes[index].created_at,
                updated_at: new Date().toISOString(),
            }
            return { responseData: classes[index], status: 200 };
        } else {
            return { responseData: { error: `Turma não encontrada, ou você não é o criador da turma.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao atualizar turma. ${error}` }, status: 400 };
    }
}

function deleteClass(classData, user_id) {
    try {
        if (!classData.id) {
            return { responseData: { error: "O ID (id) da turma é obrigatório" }, status: 400 };
        }

        const index = classes.findIndex(cls => cls.id === classData.id);
        
        if (index !== -1 && classes[index].creator_id === user_id) {
            classes.splice(index, 1);
            return { responseData: { message: 'Turma deletada com sucesso' }, status: 200 };
        } else {
            return { responseData: { error: `Turma não encontrada, ou você não é o criador da turma.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao deletar turma. ${error}` }, status: 400 };
    }
}

function joinClass(classData, user_id) {
    try {
        const index = classes.findIndex(cls => cls.id === classData.id);
        
        if (index !== -1) {
            if (!classes[index].members_ids) {
                classes[index].members_ids = [];
            }
            
            if (!classes[index].members_ids.includes(user_id) && classes[index].creator_id !== user_id) {
                classes[index].members_ids.push(user_id);
                return { responseData: classes[index], status: 200 };
            } else {
                return { responseData: { error: `Usuário já está na turma ou é o criador.` }, status: 400 };
            }
        } else {
            return { responseData: { error: `Turma não encontrada.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao entrar na turma. ${error}` }, status: 400 };
    }
}

function leaveClass(classData, user_id) {
    try {
        const index = classes.findIndex(cls => cls.id === classData.id);

        if (index !== -1) {
            if (classes[index].creator_id === user_id) {
                return { responseData: { error: `O criador não pode sair da turma.` }, status: 400 };
            }

            const memberIndex = classes[index].members_ids.indexOf(user_id);

            if (memberIndex !== -1) {
                classes[index].members_ids.splice(memberIndex, 1);
                return { responseData: classes[index], status: 200 };
            } else {
                return { responseData: { error: `Usuário não encontrado na turma.` }, status: 404 };
            }
        } else {
            return { responseData: { error: `Turma não encontrada.` }, status: 404 };
        }
    } catch (error) {
        return { responseData: { error: `Erro ao remover membro da turma. ${error}` }, status: 400 };
    }
}

function isCreator(classId, userId) {
    try {
        const cls = classes.find(cls => cls.id === classId);

        if (!cls) {
            return undefined;
        }

        if (cls.creator_id === userId) {
            return true;
        } else if (cls.members_ids.includes(userId)) {
            return false;
        } else {
            return null;
        }
    } catch (error) {
        return undefined;
    }
}


module.exports = {
    createClass,
    getClass,
    searchClasses,
    updateClass,
    deleteClass,
    joinClass,
    leaveClass,
    isCreator,
};