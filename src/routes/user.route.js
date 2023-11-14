import {Router} from 'express'
import UserController from '../controllers/user.controller.js'
import {checkAuth} from '../middlewares/checkAuth.js'
const controller = new UserController()

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/add/:idProd', checkAuth, controller.addProdToCart)
router.get('/', controller.getAll)
router.get('/id/:id', controller.getById)
router.get('/profile', checkAuth, controller.profile)

export default router;
