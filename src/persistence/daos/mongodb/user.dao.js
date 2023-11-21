import {userModel} from './models/user.model.js';
import {createHash, isValidPassword} from '../../../utils/utils.js';
import pkg from 'jsonwebtoken';
import { HttpResponse } from '../../../errors/http.response.js';
const httpResponse = new HttpResponse()
import cron from 'cron'
import { logguer } from '../../../utils/logger.js';
const {CronJob} = cron
const { sign } = pkg;




export default class UserDao {

    static async verificarInactividad() {
        const tresDiasEnMilisegundos = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
        const tiempoActual = new Date();
        
        try {
            const usuariosInactivos = await userModel.find({
                ultimaConexion: { $lt: new Date(tiempoActual - tresDiasEnMilisegundos) }
            });

            if (usuariosInactivos.length > 0) { 
                for (const usuario of usuariosInactivos) {
                    await userModel.findByIdAndDelete(usuario._id);;
                   logguer.success(`El usuario ${usuario.nombre} ha sido eliminado por inactividad.`);
                }
            } else {
                logguer.info('No hay usuarios inactivos para eliminar.');
            }
        } catch (error) {
            logguer.info('Error al verificar la inactividad de usuarios:', error);
        }
    }

    static startVerificarInactividad() {
        const job = new CronJob('0 0 * * *', () => {
            logguer.info('Ejecutando verificación de inactividad de usuarios...');
            UserDao.verificarInactividad();
        });

        job.start();
    }


    generateToken(user, timeExp) {
        const payload = {
            userId: user._id
        }
        const token = sign(payload, process.env.SECRET_KEY, {expiresIn: timeExp});

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
            httpResponse.NotFound(error)
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
                    
                    return false;
                }


            }
        } catch (error) {
            httpResponse.NotFound(error)
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
            httpResponse.NotFound(error);
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
                    model: "Product",
                })
                .exec();

             
            // Mostrar la información completa del carrito
            return (usuarioConCarritoPopulado.carts);

        } catch (error) {
            httpResponse.NotFound("Error al agregar producto al carrito:", error);

            if (error.message) {
                logguer.info("Detalles del error:", error.message);
            }

        }
    }

    async getByEmail(email) {
        try {
            const response = await userModel.findOne({ email })
           

            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async getById(id) {
        try {
            const response = await userModel.findById(id)
            return response;
        } catch (error) {
            httpResponse.NotFound(error);
        }
    }

    async getAll() {
        try {
            const response = await userModel.find({})
            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async deleteProdInCart(userId, prodId) {
        try {
            const updateUser = await userModel.findOneAndUpdate(
                { _id: userId },
                { $pull: { carts: { product: prodId } } },
                {new:true}
            )

            return updateUser;
            
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async updateUser(userId, editedUser) {
        try {
            const response = await userModel.updateOne({
                _id: userId,
            }, editedUser)
            
            return response;

        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

      async update(id, obj) {
        try {
            await userModel.updateOne({
                _id: id
            }, obj);
            return obj;
        } catch (error) {
            logguer.error(error);
        }
    }

    async olvidePassword(email) {
        try {
            
            const userExist = await this.getByEmail(email)
            if (!userExist) {
                return false;
            }

            return this.generateToken(userExist, '1h')
            
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }



    async updatePassword(userId, passwordActual,newPassword) {
        try {

            const userExist = await userModel.findById(userId);
        
            
            const validPassword = isValidPassword(userExist, passwordActual);
            console.log(validPassword)

             if (!validPassword) {
            return false;
            }
            

            const equal =  newPassword === userExist.password;
            if (equal) { 
                return false;
            }
            const nuevaPassword = createHash(newPassword)
            return await this.update(userId,{password : nuevaPassword})
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

 
}






