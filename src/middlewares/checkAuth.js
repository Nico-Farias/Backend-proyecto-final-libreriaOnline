import pkg from 'jsonwebtoken'
import UserDao from '../persistence/daos/mongodb/user.dao.js'
const userDao = new UserDao()
const {verify} = pkg;

const SECRET_KEY = 'secret_key';


export const checkAuth = async (req, res, next) => {
    try {
        const auth = req.header("Authorization");
        if (! auth) {
            return res.status(401).json({msg: 'Unauthorized login'})
        }

        const token = auth.split(' ')[1];
        const decode = verify(token, SECRET_KEY)

        const user = await userDao.getById(decode.userId)

        if (! user) {
            return res.json({msg: 'Unauthorized login '})
        }

        const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        const tokenExp = decode.exp; // Tiempo de expiración del token
        const timeUntilExp = tokenExp - now; // Tiempo hasta la expiración en segundos

    

        if (timeUntilExp <= 300) { // Generar un nuevo token
            const newToken = userDao.generateToken(user, '30m');
            console.log('>>>>>>SE REFRESCÓ EL TOKEN')
            res.set("Authorization", `Bearer ${newToken}`);
        }

        req.user = user;
        console.log(req.user)


        next()
    } catch (error) {
       console.error("Error al verificar el token:", error);
     return res.status(401).json({ msg: 'Unauthorized login. Invalid token.' });
    }
}
