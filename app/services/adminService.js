const Driver = require('../models/drivers');
const bcrypt = require('bcrypt');
const Route = require('../models/routesModel');
const Line = require('../models/lines');
const Path = require('../models/paths')
// const Path = require('../models/paths');


class AdminService {
    // Create a new Driver
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
    //UPDATE DRIVER
    async updateDriver(id,data) {
        try {
            // Certifique-se de que o usuário existe
            const driver = await Driver.findByPk(id);
    
            if (!driver) {
                return null;
            }
    
            // Verifica se o campo "password" está presente nos dados
            if (data.password) {
                // Criptografa o password
                data.password = await bcrypt.hash(data.password, 10);
            }
            return await driver.update(data);
        } catch (error) {
            console.error('Error updating driver:', error.message);
            throw error;
        }
    }
    async deleteDriver(id) {
        try {
            const driver = await Driver.findByPk(id);
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

    //LINES
    async createLine(name, schedules) {
        try {
            const existingLine = await Line.findOne({ where: { schedules } });
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
    
    async updateLine(id, data) {
        const line = await Line.findByPk(id);
        if (line) {
            return await line.update(data);
        }
        throw new Error('Line not found');
    }

    async deleteLine(id) {
        const line = await Line.findByPk(id);
        if (line) {
            return await line.destroy();
        }
        throw new Error('Line not found');
    }

    //ROUTES
    async createRoute(lineId, pathId, name, start_time, end_time) {
        const line = await Line.findByPk(lineId);
        const path = 1;
        const status = 0;
        // const path = await Path.findByPk(pathId);
    
        // Verifica se a linha e o caminho existem
        if (!line || !path) {
            throw new Error("Line or Path not found");
        }
    
        // Cria a nova rota
        const newRoute = await Route.create({ lineId, pathId, name, start_time, end_time, status });
        return newRoute;
    }

    async updateRoute(id, data) {
        const route = await Route.findByPk(id);
        if (route) {
            return await route.update(data);
        }
        throw new Error('Route not found');
    }

    async deleteRoute(id) {
        const deletedCount = await Route.destroy({
          where: { id }, // Especifica qual registro deve ser apagado
        });
      
        if (deletedCount === 0) {
          throw new Error('Route not found');
        }
      
        return { message: 'Route deleted successfully' };
      }
      

    async createPath(name, coordinates) {
        const path = await Path.findByPk(name);
        // const path = await Path.findByPk(pathId);
    
        // Verifica se a linha e o caminho existem
        if (path) {
            throw new Error("Line or Path not found");
        }
    
        // Cria a nova rota
        const newPath = await Path.create({ name, coordinates });
        return newPath;
    }

    async updatePath(id, data) {
        const path = await Path.findByPk(id);
        if (path) {
            // Especificar que a atualização deve ocorrer no registro com o id fornecido
            const newPath = await Path.update(data, {
                where: { id: id }  // A condição WHERE precisa ser fornecida aqui
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