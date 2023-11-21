import express from 'express'
import productsRouter from './routes/products.route.js'
import userRouter from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { conectarDB } from './config/connection.js';
import { logguer } from './utils/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'

conectarDB()
const app = express()


app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY_COOKIE))
app.use(express.urlencoded({extended: true}));

// configurar CORS
const whitelist = [process.env.FRONTEND_URL];



const corsOptions = {
   
    
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
            
        } else {
            
            callback(new Error('Error de cors'));
        }
    },
   
    
}




app.use(cors(corsOptions))
app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)
app.use(errorHandler)
const PORT = 4000;
app.listen(PORT, () => {
    logguer.info(`Escuchando al puerto ${PORT}`);
});
