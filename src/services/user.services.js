import UserDao from "../persistence/daos/mongodb/user.dao.js";
import pkg from 'jsonwebtoken'
import { sendEmail } from "../utils/email.js";
import { HttpResponse } from "../errors/http.response.js";
import { logguer } from "../utils/logger.js";
const httpResponse = new HttpResponse();
const {sign} = pkg;
const userDao = new UserDao()



export default class UserServices {


    #generateToken(user) {
        const payload = {
            userId: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            carts: user.carts

        }
        const token = sign(payload, process.env.SECRET_KEY, {expiresIn: '60m'})
        return token;
    }

    async register(user) {
        try {
            const response = await userDao.register(user)
            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async login(user) {
        try {
            const userExist = await userDao.login(user)
            if (userExist) {
                const token = this.#generateToken(userExist)
                return token;
            } else {
                return false;
            }


        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async addProduct(idUser, idProd, qty) {
        try {
            return await userDao.addProduct(idUser, idProd, qty)
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async getAll() {
        try {
            const items = await userDao.getAll();
            return items;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    };

    async getById(id) {
        try {
            const item = await userDao.getById(id);
            if (! item) 
                return false;
             else 
                return item;
            


        } catch (error) {
            httpResponse.NotFound(error)
        }
    };

    async getByEmail(email) {
        try {
            const response = await userDao.getByEmail(email)
            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async deleteProdInCart(userId, prodId) { 
        try {
            const response = await userDao.deleteProdInCart(userId, prodId)
            return response;
            
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async updateUser(userId, editedUser) {
        try {
            const response = await userDao.updateUser(userId, editedUser)
            return response;
            
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async olvidePassword(email) {
        try {
            const token = await userDao.olvidePassword(email)
            console.log(token)
            const user = await userDao.getByEmail(email)
            if (!token) {
                return false;
            }
            logguer.success('Email enviado correctamente')
            return await sendEmail(user,'resetPass', token)
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }


    async updatePassword(user,passwordActual, newPassword) { 
        try {
            const response = await userDao.updatePassword(user,passwordActual, newPassword)
            return response;
            
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

}
