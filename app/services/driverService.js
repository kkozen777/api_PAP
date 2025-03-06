const Driver = require('../models/drivers'); // Importa o modelo Driver

class DriverService {
    // Busca todos os motoristas
    async getAllDrivers() {
        try {
            const drivers = await Driver.findAll(); // Recupera todos os registos da tabela Driver
            return drivers;
        } catch (error) {
            console.error('Error fetching drivers:', error.message); // Regista o erro, se houver
            throw error; // Lança o erro para ser tratado mais à frente
        }
    }

    // Busca um motorista pelo ID
    async getDriverById(driverId) {
        try {
            const driver = await Driver.findByPk(driverId); // Procura o motorista pela chave primária
            if (!driver) {
                throw new Error('Driver not found'); // Lança erro se não encontrar
            }
            return driver; // Retorna o motorista encontrado
        } catch (error) {
            console.error('Error fetching Driver by ID:', error.message);
            throw error;
        }
    }

    // Busca apenas o nome de um motorista pelo ID
    async getDriverName(id) {
        try {
            const driver = await Driver.findByPk(id);
            if (!driver) {
                throw new Error('Driver not found');
            }
            return driver.name; // Retorna apenas o nome do motorista
        } catch (error) {
            console.error('Error fetching Driver by ID:', error.message);
            throw error;
        }
    }
}

module.exports = DriverService; // Exporta a classe DriverService