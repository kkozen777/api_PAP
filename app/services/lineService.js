const Line = require('../models/lines'); // Importa o modelo Line

class LineService {
    // Busca todas as linhas
    async getAllLines() {
        const lines = await Line.findAll(); // Recupera todos os registos da tabela Line
        return lines; // Retorna a lista de linhas
    }

    // Busca uma linha pelo ID
    async getLineById(id) {
        return await Line.findByPk(id); // Procura a linha pela chave primária e retorna
    }
}

module.exports = LineService; // Exporta a classe LineService
