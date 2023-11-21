import {Router} from 'express'
import ProductController from '../controllers/prod.controller.js';
import {checkAdmin} from '../middlewares/checkAdmin.js';
import {checkAuth} from '../middlewares/checkAuth.js';
const controllers = new ProductController();

const router = Router();

router.get('/', controllers.getAll);
router.get('/id/:id', controllers.getById);
router.get('/category/:categoria', controllers.filterCategory)
router.post('/new-product', checkAdmin, controllers.create)
router.put('/update-product/:id', checkAdmin, controllers.update)
router.delete('/delete-product/:id', checkAdmin, controllers.delete)
router.delete('/delete-product-cart/:id', checkAdmin, controllers.delete)

export default router;
