import UserServices from "../services/user.services.js";
import TicketDao from "../persistence/daos/mongodb/ticket.dao.js";
import { isValidPassword } from "../utils/utils.js";
import { emailFinalizarCompra, sendEmail } from '../utils/email.js';
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
import generarId from '../utils/generarId.js';
import { createHash } from '../utils/utils.js';
import { logguer } from "../utils/logger.js";

const userService = new UserServices()
const ticketDao = new TicketDao();



export default class UserController {


    async register(req, res, next) {
        try {
            const newUser = await userService.register(req.body);

            if (! newUser) {
                res.json({msg: 'user not registered'})
            }

            sendEmail(newUser, 'register')
            res.json({ msg: 'Usuario creado correctamente' })
            logguer.info('Email enviado correctamente')

        } catch (error) {
            next(error.message);
        }
    };


    async login(req, res, next) {
        try {
            const token = await userService.login(req.body);
            const {email} = req.body
            const user = await userService.getByEmail(email)

            if (!token) {
                res.status(403).json({ msg: 'Email o password incorrectos' })
                return;
            }

            if (! user) {
                res.json({msg: 'Usuario no registrado'})
            }

            //GUARDAR ULTIMO LOGUEO
            user.ultimaConexion = new Date()
            await user.save()

            res.header("Authorization", token);
            
            res.json({user, token})


        } catch (error) {
            next(error.message);
        }
    };

    async getAll(req, res, next) { 
        try {
            const usuarios = await userService.getAll({})
            if (usuarios.length === 0) {
                res.status(404).json({ msg: 'No hay usuarios' })
            }
           return  res.status(200).json(usuarios)
        } catch (error) {
            next(error.message);
        }
    }

    async userRepositoryDto(req, res, next) {

        try {
            const {id} = req.params;
            const newUser = await userService.userRepositoryDto(id)
            if (! newUser) {
                return false;
            } else 
                res.json(newUser)

            

        } catch (error) {
            next(error.message)
        }
    }

    async getById(req, res, next) {
        const {id} = req.params;
        const response = await userService.getById(id)

        if (! response) {
            res.status(404).json({msg: 'Not Found'})
        } else {
            res.json(response)
        }
    }

    async addProdToCart(req, res, next) {
        try {
            const { _id } = req.user;
            console.log(req.user)
          
            const {idProd} = req.params;
            const {qty} = req.body;
            const newProdInCart = await userService.addProduct(_id, idProd, Number(qty));
            if (!newProdInCart) {
                return false;
            }
                
           
              return  res.status(200).json(newProdInCart)
            
            


        } catch (error) {
            next(error.message)
        }
    }

    async getAll(req, res, next) {
        try {
            const response = await userService.getAll()
            res.json(response)
        } catch (error) {
            next(error.message)
        }
    }


    profile = (req, res, next) => {
        try {
            const user = req.user;
            res.json({user})
        } catch (error) {
            next(error.message);
        }
    };

    async finalizarCompras (req, res, next)  { 
        try {
            
            const { _id } = req.user;
            const user = req.user;

            const finalizar = await ticketDao.generateTicket(_id)

            emailFinalizarCompra({
                ticket: finalizar,
                nombre: user.nombre,
                email: user.email
            })

           return res.json({msg: 'Compra correcta', finalizar})


        } catch (error) {
            next(error.message);
        }
    }

    async deleteProdInCart (req, res, next) { 
        try {
            const { userId, prodId } = req.params;
            const updateUser = await userService.deleteProdInCart(userId, prodId)

            if (!userId || !prodId) {
                return res.status(401).json({msg: 'error al eliminar producto'})
            }

            res.status(200).json({ msg:'Producto eliminado', updateUser})
    
        } catch (error) {
          next(error.message); 
        }

    }


    async updateUser(req, res, next) {
        try {
            const { userId } = req.params;
            const { editedUser } = req.body;
            if (!userId) {
                return res.status(401).json({ msg: 'user not found' })
            }
            
            const userActualizado = await userService.updateUser(userId, editedUser)

            return res.status(200).json({ msg: 'User actualizado', userActualizado })
            
            
        } catch (error) {
            next(error.message);
        }
    }

    
    olvidePassword = async (req, res, next) => {

            const { email } = req.body;
            const token = generarId()
            const user = await userService.getByEmail(email)


            if (!user) {
                res.status(401).json({ msg: 'El usuario no existe' })
            };

        try {
    
            user.tokenReset = token;
            await user.save()
          
            await sendEmail(user,'resetPass', token)
            console.log(user)
            return res.status(200).json({ msg: 'Email enviado' })

        } catch (error) {
            next(error.message);
        }
    }

    
    resetPassword = async (req, res, next) => {
         
        const { newPassword } = req.body;
        const { tokenReset } = req.params;
        
        console.log(tokenReset)
        const usuario = await userModel.findOne({ tokenReset })
        console.log('USUARIO DEL TOKEN', usuario)
        
        if (usuario) {
            usuario.password = createHash(newPassword);
            usuario.tokenReset = '';

           try {
            await usuario.save()
            return res.status(200).json({msg: 'password actualizada correctamente',usuario})

          } catch (error) {
            console.log(error)
          
        }
        } else {
            const error = new Error('Token no valido')
            return res.status(404).json({ msg: error.message })
        }
        
   
    }


    updatePassword = async (req, res, next) => {
        try {
            const user = req.user;
            const { passwordActual,newPassword } = req.body;
            
            const equal = newPassword === user.password;
        
        
            if (equal) {
                 return res.status(400).json({ msg: 'La nueva contraseña debe ser diferente a la actual' });
            }

            const update = await userService.updatePassword(user._id,passwordActual, newPassword);
            
            if (! update) {
                return res.status(404).json({msg: 'Tu password actual es incorrecta'})
            }

         

            return res.status(200).json({msg: 'password actualizada correctamente', update})

        } catch (error) {
            
            return res.status(500).json({ msg: 'Hubo un error al actualizar la contraseña' });
        }
    }

    
}
