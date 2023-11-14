import pkg from 'jsonwebtoken'
import UserDao from '../persistence/daos/mongodb/user.dao.js'
const userDao = new UserDao()
const {verify} = pkg;

const SECRET_KEY = 'secret_key';


export const checkAdmin = async (req, res, next) => {
    try {
        const auth = req.get("Authorization");
        if (! auth) {
            return res.json({msg: 'Unauthorized'})
        }

        const token = auth.split(' ')[1];
        const decode = verify(token, SECRET_KEY)

        const user = await userDao.getById(decode.userId)

        if (! user) {
            return res.json({msg: 'Unauthorized'})
        }
        const userAdmin = user.admin;

        if (userAdmin !== true) {
            return res.json({msg: 'Unauthorized'})
        }

        next()
    } catch (error) {
        next(error.message)
    }
}
