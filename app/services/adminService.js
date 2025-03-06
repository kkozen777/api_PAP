// importar os models que vão ser utilizados
const Driver = require('../models/drivers');
const bcrypt = require('bcrypt');
const Route = require('../models/routesModel');
const Line = require('../models/lines');
const Path = require('../models/paths')

// classe criada para guardar todas estas funçõesA
class AdminService {
    // criar um novo motorista
    async createDriver(driverNumber, password, name) {
        try {
            const existingDriver = await Driver.findOne({ where: { driverNumber } });
            if(existingDriver){
                return null;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newDriver = await Driver.create({ driverNumber, password: hashedPassword, name });
            return newDriver;
        } catch (error) {
            console.error('Error creating Driver:', error.message);
            throw error;
        }
    }
    //altera os valores de um motorista
    async updateDriver(id,data) {
        try {
            const driver = await Driver.findByPk(id);
    
            if (!driver) {
                return null;
            }
    
            // Verifica se o campo "password" está presente nos dados, se estiver, criptografa
            if (data.password) {
                // Criptografa a password
                data.password = await bcrypt.hash(data.password, 10);
            }
            return await driver.update(data);
        } catch (error) {
            console.error('Error updating driver:', error.message);
            throw error;
        }
    }
    //elimina um motorista
    async deleteDriver(id) {
        try {
            const driver = await Driver.findByPk(id);
            //caso o motorista já não exista, retorna null
            if (!driver) {
                return null;
            }
            await driver.destroy();
            return { message: 'driver deleted successfully.' };
        } catch (error) {
            console.error('Error deleting driver:', error.message);
            throw error;
        }
    }

    //cria uma linha
    async createLine(name, schedules) {
        try {
            //verifica se a linha que esta a ser criada ja existe
            const existingLine = await Line.findOne({ where: { name } });
            if(existingLine){
                return null;
            }

            const newLine = await Line.create({ name, schedules });
            return newLine;
        } catch (error) {
            console.error('Error creating line:', error.message);
            throw error;
        }
    }
    // atualiza uma linha
    async updateLine(id, data) {
        const line = await Line.findByPk(id);
        if (line) {
            return await line.update(data);
        }
        throw new Error('Line not found');
    }
    //elimina uma linha
    async deleteLine(id) {
        const line = await Line.findByPk(id);
        if (line) {
            return await line.destroy();
        }
        throw new Error('Line not found');
    }

    //criar rota
    async createRoute(lineId, pathId, name, start_time, end_time) {
        const line = await Line.findByPk(lineId);
        const path = await Path.findByPk(pathId);
        //status 0 predifinido
        const status = 0;
    
        // Verifica se a linha e o caminho existem
        if (!line || !path) {
            throw new Error("Line or Path not found");
        }
    
        // Cria a nova rota
        const newRoute = await Route.create({ lineId, pathId, name, start_time, end_time, status });
        return newRoute;
    }

    //Atualiza rota
    async updateRoute(id, data) {
        //verifica se a rota existe
        const route = await Route.findByPk(id);
        if (route) {
            return await route.update(data);
        }
        throw new Error('Route not found');
    }

    //elimna a rota
    async deleteRoute(id) {
        const route = await Route.findByPk(id);
        if (route) {
            return await route.destroy();
        }
        throw new Error('Route not found');
    }
      
    //criar um caminho
    async createPath(name, coordinates) {
        const path = await Path.findByPk(name);
    
        // Verifica se o caminho existe
        if (path) {
            throw new Error("path already exists");
        }
    
        // Cria o caminho
        const newPath = await Path.create({ name, coordinates });
        return newPath;
    }
    //atualiza um caminho
    async updatePath(id, data) {
        const path = await Path.findByPk(id);
        if (path) {
            const newPath = await Path.update(data, {
                where: { id: id }
            });
            return newPath;
        }
        throw new Error('Path not found');
    }
    
    async deletePath(id) {
        const path = await Path.findByPk(id);
        if (path) {
            await path.destroy(); // Remove o registro diretamente
            return { message: 'Path deleted successfully' };
        }
        throw new Error('Path not found');
    }
}

module.exports = AdminService;