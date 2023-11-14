import express from 'express'
import productsRouter from './routes/products.route.js'
import userRouter from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import './config/connection.js'

const app = express()

dotenv.config()


app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY_COOKIE))
app.use(express.urlencoded({extended: true}));

// configurar CORS
const whitelist = ['http://localhost:5173'];



const corsOptions = {
   
    
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true)
            console.log('error en el if')
        } else {
            console.log('Error de CORS para origin:', origin);
            callback(new Error('Error de cors'));
        }
    },
   
    
}




app.use(cors(corsOptions))
app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT}`);
});
