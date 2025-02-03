const Path = require('../models/paths');

class PathService {

    async getAllPaths() {
        return await Path.findAll();
    }

    async getPathById(id) {
        return await Path.findByPk(id);
    }
}

module.exports = PathService;
