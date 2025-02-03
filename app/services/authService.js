const Driver = require('../models/drivers');
const User = require('../models/users');
const Admin = require ('../models/admin')
const dotenv = require('dotenv')
dotenv.config({ path: './.env'});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async authenticateAdmin(name, password) {
        try {
            const admin = await Admin.findOne({ where: { name } });
            if (!admin) {
                return null; // driver não encontrado
            }

            // Verificar a senha
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return null; // Senha inválida
            }

            // Gerar um token JWT
            const token = jwt.sign({ id: admin.id, name: admin.name, password: admin.password }, process.env.JWT_SECRET, { expiresIn: '12h' });
            return { token, admin };
        } catch (error) {
            console.error('Error authenticating admin:', error.message);
            throw error;
        }
    }

    async authenticateDriver(driverNumber, password) {
        try {
            const driver = await Driver.findOne({ where: { driverNumber } });
            if (!driver) {
                return null; // driver não encontrado
            }

            // Verificar a senha
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                return null; // Senha inválida
            }

            // Gerar um token JWT
            const token = jwt.sign({ id: driver.id, driverNumber: driver.driverNumber, name: driver.name }, process.env.JWT_SECRET, { expiresIn: '12h' });
            return { token, driver };
        } catch (error) {
            console.error('Error authenticating driver:', error.message);
            throw error;
        }
    }
    
    // Create a new user
    async signupUser(email, password, name) {
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists'); // <---- Lançar erro ao invés de retornar null
            }
    
            // Hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword, name });
    
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error.message);
            throw error;
        }
    }

    async authenticateUser(email, password) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return null; // user não encontrado
            }

            // Verificar a senha
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null; // Senha inválida
            }

            // Gerar um token JWT
            
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET, 
                { expiresIn: '12h'}
            );

            return { token, user };
        } catch (error) {
            console.error('Error authenticating user:', error.message);
            throw error;
        }
    }
    
    // Decodifica o token sem verificar a validade
    async decodeToken(token) {
        try {
        return jwt.decode(token);
        } catch (err) {
        console.error('Erro ao decodificar o token:', err);
        return null;
        }
    }
    
    // Verifica se o token está autenticado e válido
    async isAuthenticated(token) {
        try {
        jwt.verify(token, JWT_SECRET);
        return true;
        } catch (err) {
        return false;
        }
    }
    
    // Extrai um valor específico do payload do token
    async getTokenValue(token, key) {
        const decoded = jwt.decode(token);
        const value = decoded[key];
        if (decoded) {
          return value;
        } else {
          return null;
        }
    }
    
    async isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) return true;
            const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
            return decoded.exp < currentTime;
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            return true; // Se algo der errado, consideramos o token expirado
        }
    }

    async changeUserPassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return { success: false, message: "User not found" };
            }
    
            // Verifica a senha atual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                console.log("Senha inválida");
                return { success: false, message: "Current password is incorrect" };
            }
    
            // Atualiza para a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
    
            return { success: true };
        } catch (error) {
            console.error("Error in changePassword:", error.message);
            throw error;
        }
    }
    
    
      // Método para alterar email
      async changeEmail(userId, newEmail) {
        try {
          // Tenta encontrar o usuário na tabela Users
          let user = await User.findByPk(userId);
        if (!user) {
            return { success: false, message: "User not found" };
        }
    
          // Verifica se o novo email já está em uso
          const existingUser = await User.findOne({ where: { email: newEmail } });
    
          if (existingUser) {
            return { success: false, message: "Email already in use" };
          }
    
          // Atualiza o email
          user.email = newEmail;
          await user.save();
    
          return { success: true };
        } catch (error) {
          console.error("Error in changeEmail:", error.message);
          throw error;
        }
    }

    async deleteAccount(userId) {
        try {
          const user = await User.findByPk(userId);
      
          if (!user) {
            return { success: false, message: "User not found" };
          }
      
          await user.destroy(); // Remove o usuário do banco de dados
      
          return { success: true, message: "Account deleted successfully" };
        } catch (error) {
          console.error("Error deleting account:", error);
          return { success: false, message: "Database error" };
        }
    }
      
    async changeDriverPassword(driverId, currentPassword, newPassword) {
        try {
            const driver = await Driver.findByPk(driverId);
            if (!driver) {
                return { success: false, message: "driver not found" };
            }
    
            // Verifica a senha atual
            const isPasswordValid = await bcrypt.compare(currentPassword, driver.password);
            if (!isPasswordValid) {
                console.log("Senha inválida");
                return { success: false, message: "Current password is incorrect" };
            }
    
            // Atualiza para a nova senha
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            driver.password = hashedPassword;
            await driver.save();
    
            return { success: true };
        } catch (error) {
            console.error("Error in changePassword:", error.message);
            throw error;
        }
    }
}

module.exports = AuthService;