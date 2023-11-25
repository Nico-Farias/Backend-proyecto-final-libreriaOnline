import express from 'express'
import productsRouter from './routes/products.route.js'
import userRouter from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { conectarDB } from './config/connection.js';
import { logguer } from './utils/logger.js'
//import { errorHandler } from './middlewares/errorHandler.js'
import { swaggerOptions } from './docs/info.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
 conectarDB()


const app = express()


const specs = swaggerJSDoc(swaggerOptions)
app.use('/documentacion', swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY_COOKIE))
app.use(express.urlencoded({extended: true}));

// configurar CORS
const BACKEND = 'localhost:4000/api/products'
const whitelist = [process.env.FRONTEND_URL, BACKEND];



const corsOptions = {

    origin:'*'
    /*
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
            
        } else {
            
            callback(new Error('Error de cors'));
        }
    },
   */
    
}

app.use(cors(corsOptions))
app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)
//app.use(errorHandler)


const PORT = 4000;
app.listen(PORT, () => {
    logguer.info(`Escuchando al puerto ${PORT}`);
});

export default app;