import pkg from 'jsonwebtoken'
import UserDao from '../persistence/daos/mongodb/user.dao.js'
const userDao = new UserDao()
import { HttpResponse } from '../errors/http.response.js';
const httpResponse = new HttpResponse()
const {verify} = pkg;




export const checkPremium = async (req, res, next) => {
    try {
        const auth = req.get("Authorization");
        if (! auth) {
           return res.json({msg: 'Unauthorized'})
        }

        const token = auth.split(' ')[1];
        const decode = verify(token, process.env.SECRET_KEY)

        const user = await userDao.getById(decode.userId)

        if (! user) {
          return res.json({msg: 'Unauthorized'})
        }
        const userPremium = user.role.premium;

        if (userPremium !== true) {
          return res.json({msg: 'Unauthorized'})
        }

        next()
    } catch (error) {
        next(error.message)
    }
}
