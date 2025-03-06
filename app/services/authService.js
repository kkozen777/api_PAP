//models utilizados
const Driver = require('../models/drivers');
const User = require('../models/users');
const Admin = require ('../models/admin')
const dotenv = require('dotenv')
dotenv.config({ path: './.env'});//para utilizar as variaveis de ambiente
const bcrypt = require('bcrypt');//Criptografia de passwords
const jwt = require('jsonwebtoken'); //tokens

class AuthService {
    //fazer login de admin
    async authenticateAdmin(name, password) {
        try {
            const admin = await Admin.findOne({ where: { name } });
            if (!admin) {
                return null; // driver não encontrado
            }

            // Verificar a pass recebida com a pass criptografada na base de dados
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return null; // pass inválida
            }

            // Gerar um token JWT
            const token = jwt.sign(
            { 
                //valores a guardar no token
                id: admin.id, 
                name: admin.name, 
                password: admin.password 
            }, process.env.JWT_SECRET, { expiresIn: '12h' }); //expiresIn é o tempo que o token fica ativo
            return { token, admin };
        } catch (error) {
            console.error('Error authenticating admin:', error.message);
            throw error;
        }
    }
    //login do motorista, é a mesma coisa que o admin
    async authenticateDriver(driverNumber, password) {
        try {
            const driver = await Driver.findOne({ where: { driverNumber } });
            if (!driver) {
                return null; // driver não encontrado
            }

            // Verificar a pass
            const isPasswordValid = await bcrypt.compare(password, driver.password);
            if (!isPasswordValid) {
                return null; // pass inválida
            }

            // Gerar um token JWT
            const token = jwt.sign({ id: driver.id, 
                driverNumber: driver.driverNumber, 
                name: driver.name 
            }, process.env.JWT_SECRET, { expiresIn: '12h' });
            return { token, driver };
        } catch (error) {
            console.error('Error authenticating driver:', error.message);
            throw error;
        }
    }
    
    // login do utilizador, identico ao de motorista e admin
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

    // signup utilizador, cria um novo utlizador
    async signupUser(email, password, name) {
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists'); 
            }
    
            // criptografar password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword, name });
    
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error.message);
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
    
    // Verifica se o token ainda é válido, por ex
    //se ele expirar, deixa de ser válido
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
    
    //verifica diretamente se o token esta ou nao expirado pelo tempo dele.
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

    //caso o utilizador queira alterar a sua password, os dados são tratados neste service
    async changeUserPassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return { success: false, message: "User not found" };
            }
    
            // Verifica a pass atual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                // console.log("pass inválida");
                return { success: false, message: "Current password is incorrect" };
            }
    
            // Atualiza para a nova pass
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
    
            return { success: true };
        } catch (error) {
            console.error("Error in changePassword:", error.message);
            throw error;
        }
    }
    
    
      // caso o utilizador queira alterar o seu email
      async changeEmail(userId, newEmail) {
        try {
          // Tenta encontrar o user na tabela Users
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

    // caso o utilizador queira eliminar a sua conta
    async deleteAccount(userId) {
        try {
          const user = await User.findByPk(userId);
      
          if (!user) {
            return { success: false, message: "User not found" };
          }
      
          await user.destroy(); // Remove o user da base de dados
      
          return { success: true, message: "Account deleted successfully" };
        } catch (error) {
          console.error("Error deleting account:", error);
          return { success: false, message: "Database error" };
        }
    }
    
    //caso o motorista queira alterar a sua password
    async changeDriverPassword(driverId, currentPassword, newPassword) {
        try {
            const driver = await Driver.findByPk(driverId);
            if (!driver) {
                return { success: false, message: "driver not found" };
            }
    
            // Verifica a pass atual
            const isPasswordValid = await bcrypt.compare(currentPassword, driver.password);
            if (!isPasswordValid) {
                // console.log("pass inválida");
                return { success: false, message: "Current password is incorrect" };
            }
    
            // Atualiza para a nova pass
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