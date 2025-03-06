const Path = require('../models/paths'); // Importa o modelo path

class PathService {
    //busca os paths todos
    async getAllPaths() {
        return await Path.findAll();// recebe todos os registos na tabela paths e da return
    }

    //procura path por id
    async getPathById(id) {
        return await Path.findByPk(id); //procura path pela chave primária e retorna
    }
}

module.exports = PathService;