const Line = require('../models/lines');

class LineService {
    async getAllLines() {
        const lines = await Line.findAll();
        return lines;
    }

    async getLineById(id) {
        return await Line.findByPk(id);
    }
}

module.exports = LineService;
