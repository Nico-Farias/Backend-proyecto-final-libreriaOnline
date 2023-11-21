import {Router} from 'express'
import UserController from '../controllers/user.controller.js'
import {checkAuth} from '../middlewares/checkAuth.js'
import { checkAdmin } from '../middlewares/checkAdmin.js';
const controller = new UserController()

const router = Router()

//USUARIO
router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/profile', checkAuth, controller.profile)
router.get('/users/all-users', checkAdmin,controller.getAll)
router.get('/id/:id', controller.getById)

//CARRITO
router.post('/add/:idProd', checkAuth, controller.addProdToCart)
router.post('/finalizar-compra', checkAuth, controller.finalizarCompras)
router.put('/update-cart/:userId/:prodId', checkAuth, controller.deleteProdInCart)

//CAMBIAR PASSWORD LOGUEADO
router.put('/update-password', checkAuth, controller.updatePassword)
router.put('/update-user/:userId', checkAuth, controller.updateUser)

//RECUPERAR CONTRASEÑA
router.post('/olvide-password', controller.olvidePassword)
router.put('/reset-password/:tokenReset', controller.resetPassword)

export default router;
