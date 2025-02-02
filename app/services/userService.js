require('dotenv').config(); 

const User = require('../models/users');
const bcrypt = require('bcrypt');

class UserService {
    async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error.message);
            throw error;
        }
    }

    async getUserName(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user.name;
        } catch (error) {
            console.error('Error fetching User by ID:', error.message);
            throw error;
        }
    }

    // Fetch a single user by ID
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error('Error fetching user by ID:', error.message);
            throw error;
        }
    }
    async updateUser(id, data) {
        try {
            // Certifique-se de que o usuário existe
            const user = await User.findByPk(id);
    
            if (!user) {
                return null;
            }
    
            // Verifica se o campo "password" está presente nos dados
            if (data.password) {
                // Criptografa o password
                data.password = await bcrypt.hash(data.password, 10);
            }
            return await user.update(data);
        } catch (error) {
            console.error('Error updating user:', error.message);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }
            await user.destroy();
            return { message: 'user deleted successfully.' };
        } catch (error) {
            console.error('Error deleting user:', error.message);
            throw error;
        }
    }
    
}

module.exports = UserService;