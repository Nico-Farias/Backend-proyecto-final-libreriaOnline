import {userModel} from './models/user.model.js';
import {createHash, isValidPassword} from '../../../utils/utils.js';
import pkg from 'jsonwebtoken';
const {sign} = pkg;

const SECRET_KEY = 'secret_key';

export default class UserDao {

    generateToken(user, timeExp) {
        const payload = {
            userId: user._id
        }
        const token = sign(payload, SECRET_KEY, {expiresIn: timeExp});

        return token;
    }

    async register(user) {
        try {
            const {email, password} = user;
            const userExist = await this.getByEmail(email)
            if (! userExist) {
                const response = await userModel.create({
                    ...user,
                    password: createHash(password)
                })
                return response;
            } else 
                return false;
            


        } catch (error) {
            console.log(error.message);
        }
    }

    async login(user) {
        try {
            const {email, password} = user;
            const userExist = await this.getByEmail(email)
            if (userExist) {
                const validPass = isValidPassword(userExist, password)
                if (validPass) {
                    return userExist;
                } else {
                    console.log('no paso')
                    return false;
                }


            }
        } catch (error) {
            console.log(error)
        }
    }

    


    async addProductCart(idUser, idProd, qty) {
        try {
            const user = await this.getById(idUser);

            if (! user) {
                throw new Error('Usuario no encontrado');
            }

            // Buscar si el producto ya está en el carrito
            const existingProduct = user.carts.find(product => product.product.equals(idProd));

            if (existingProduct) { // El producto ya está en el carrito, actualiza la cantidad
                if (existingProduct.qty !== undefined) {
                    existingProduct.qty += qty;
                } else {
                    existingProduct.qty = qty;
                }
            } else { // El producto no está en el carrito, agrégalo
                user.carts.push({product: idProd, qty: qty});
            }

            // Guarda la actualización en la base de datos
            const updatedUser = await user.save();

            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    }

    async addProduct(idUser, idProd, qty) {
        
        try {
                const user = await this.getById(idUser);

            if (! user) {
                throw new Error('Usuario no encontrado');
            }
            await this.addProductCart(idUser, idProd, qty);

            const usuarioConCarritoPopulado = await userModel
                .findById(idUser)
                .populate({
                    path: "carts.product",
                    model: "products",
                })
                .exec();

             console.log("Respuesta del servidor en addProduct:", usuarioConCarritoPopulado.carts);
            
            // Mostrar la información completa del carrito
            return (usuarioConCarritoPopulado.carts);

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);

            if (error.message) {
                console.error("Detalles del error:", error.message);
            }

        }
    }

    async getByEmail(email) {
        try {
            const response = await userModel.findOne({ email })
           

            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async getById(id) {
        try {
            const response = await userModel.findById(id)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {
            const response = await userModel.find({})
            return response;
        } catch (error) {
            console.log(error)
        }
    }


}
