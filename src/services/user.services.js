import UserDao from "../persistence/daos/mongodb/user.dao.js";
import pkg from 'jsonwebtoken'
const {sign} = pkg;
const userDao = new UserDao()

const SECRET_KEY = 'secret_key';

export default class UserServices {


    #generateToken(user) {
        const payload = {
            userId: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            carts: user.carts

        }
        const token = sign(payload, SECRET_KEY, {expiresIn: '60m'})
        return token;
    }

    async register(user) {
        try {
            const response = await userDao.register(user)
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async login(user) {
        try {
            const userExist = await userDao.login(user)
            if (userExist) {
                const token = this.#generateToken(userExist)
                console.log('token', token)
                return token;
            } else {
                return false;
            }


        } catch (error) {
            console.log(error)
        }
    }

    async addProduct(idUser, idProd, qty) {
        try {
            return await userDao.addProduct(idUser, idProd, qty)
        } catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        try {
            const items = await userDao.getAll();
            return items;
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    };

    async getByEmail(email) {
        try {
            const response = await userDao.getByEmail(email)
            return response;
        } catch (error) {
            console.log(error)
        }
    }


}
