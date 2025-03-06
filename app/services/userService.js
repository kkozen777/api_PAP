// Importação do modelo de utilizadores
const User = require('../models/users');

class UserService {
    
    // Método para obter todos os utilizadores registados na base de dados
    async getAllUsers() {
        try {
            const users = await User.findAll(); // Obtém todos os utilizadores
            return users;
        } catch (error) {
            console.error('Error fetching users:', error.message); 
            throw error; // Lança o erro para ser tratado externamente
        }
    }

    // Método para obter o nome de um utilizador pelo seu ID
    async getUserName(id) {
        try {
            const user = await User.findByPk(id); // Procura um utilizador pelo ID
            if (!user) {
                throw new Error('User not found'); // Lança um erro se o utilizador não for encontrado
            }
            return user.name; // Retorna apenas o nome do utilizador
        } catch (error) {
            console.error('Error fetching User by ID:', error.message);
            throw error; // Lança o erro para ser tratado externamente
        }
    }

    // Método para obter um utilizador pelo seu ID
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId); // Procura um utilizador pelo ID
            if (!user) {
                throw new Error('User not found'); // Lança um erro se o utilizador não for encontrado
            }
            return user; // Retorna o objeto do utilizador encontrado
        } catch (error) {
            console.error('Error fetching user by ID:', error.message); 
            throw error; // Lança o erro para ser tratado externamente
        }
    }
    
}

// Exporta a classe UserService para que possa ser utilizada noutros ficheiros
module.exports = UserService;
