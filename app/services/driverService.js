const Driver = require('../models/drivers');

class DriverService {
    // Fetch all Driver
    async getAllDrivers() {
        try {
            const drivers = await Driver.findAll();
            return drivers;
        } catch (error) {
            console.error('Error fetching drivers:', error.message);
            throw error;
        }
    }

    // Fetch a single Driver by ID
    async getDriverById(driverId) {
        try {
            const driver = await Driver.findByPk(driverId);
            if (!driver) {
                throw new Error('Driver not found');
            }
            return Driver;
        } catch (error) {
            console.error('Error fetching Driver by ID:', error.message);
            throw error;
        }
    }

    async getDriverName(id) {
        try {
            const driver = await Driver.findByPk(id);
            if (!driver) {
                throw new Error('Driver not found');
            }
            return driver.name;
        } catch (error) {
            console.error('Error fetching Driver by ID:', error.message);
            throw error;
        }
    }
}

module.exports = DriverService;