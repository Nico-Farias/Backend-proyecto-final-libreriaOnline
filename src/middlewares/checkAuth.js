import pkg from 'jsonwebtoken'
import UserDao from '../persistence/daos/mongodb/user.dao.js'
import { logguer } from '../utils/logger.js';
import { HttpResponse } from '../errors/http.response.js';
const httpResponse = new HttpResponse()
const userDao = new UserDao()
const {verify} = pkg;




export const checkAuth = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (! auth) {
            return res.json({msg: 'Unauthorized'})
        }

        const token = auth.split(' ')[1];
        const decode = verify(token, process.env.SECRET_KEY)

        const user = await userDao.getById(decode.userId)

        if (! user) {
             return res.json({msg: 'Unauthorized'})
        }

        const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        const tokenExp = decode.exp; // Tiempo de expiración del token
        const timeUntilExp = tokenExp - now; // Tiempo hasta la expiración en segundos

    

        if (timeUntilExp <= 300) { // Generar un nuevo token
            const newToken = userDao.generateToken(user, '30m');
            logguer.info('>>>>>>SE REFRESCÓ EL TOKEN')
            res.set("Authorization", `Bearer ${newToken}`);
        }

        req.user = user;

        next()
    } catch (error) {
       logguer.error("Error al verificar el token:", error);
      return res.json({msg: 'Unauthorized'})
    }
}
