import UserServices from "../services/user.services.js";
const userService = new UserServices()


export default class UserController {


    async register(req, res, next) {
        try {
            const newUser = await userService.register(req.body);

            if (! newUser) {
                res.json({msg: 'user not registered'})
            }

            res.json({msg: 'Usuario creado correctamente'})

        } catch (error) {
            next(error.message);
        }
    };


    async login(req, res, next) {
        try {
            const token = await userService.login(req.body);
            const {email} = req.body
            const user = await userService.getByEmail(email)

            if (!token) {
                res.status(403).json({ msg: 'Email o password incorrectos' })
                return;
            }

            if (! user) {
                res.json({msg: 'Usuario no registrado'})
            }

            res.header("Authorization", token);
            res.json({user, token})


        } catch (error) {
            next(error.message);
        }
    };

    async userRepositoryDto(req, res, next) {

        try {
            const {id} = req.params;
            const newUser = await userService.userRepositoryDto(id)
            if (! newUser) {
                return false;
            } else 
                res.json(newUser)

            

        } catch (error) {
            next(error.message)
        }
    }

    async getById(req, res, next) {
        const {id} = req.params;
        const response = await userService.getById(id)

        if (! response) {
            res.status(404).json({msg: 'Not Found'})
        } else {
            res.json(response)
        }
    }

    async addProdToCart(req, res, next) {
        try {
            const { _id } = req.user;
            console.log(req.user)
          
            const {idProd} = req.params;
            const {qty} = req.body;
            const newProdInCart = await userService.addProduct(_id, idProd, Number(qty));
            if (! newProdInCart) 
                return false;
             else 
                res.json(newProdInCart);
            


        } catch (error) {
            next(error.message)
        }
    }

    async getAll(req, res, next) {
        try {
            const response = await userService.getAll()
            res.json(response)
        } catch (error) {
            next(error.message)
        }
    }


    profile = (req, res, next) => {
        try {
            const user = req.user;
            res.json({user})
        } catch (error) {
            next(error.message);
        }
    };

    /*
   
    cambiarPassword = async (req, res, next) => {


        try {
            const user = req.user;
            console.log('controller', user)
            const tokenReset = await userService.cambiarPassword(user)
            console.log('tokenReset', tokenReset)

            if (! tokenReset) {
                httpResponse.NotFound(res, 'Not send email')
            }
            res.cookie('tokenreset', tokenReset)

            return httpResponse.ok(res, 'email enviado')

        } catch (error) {
            next(error.message);
        }
    }


    updatePassword = async (req, res, next) => {
        try {
            const user = req.user;
            const {password} = user;
            const {tokenreset} = req.cookies;

            if (!tokenreset) {
                return httpResponse.NotFound(res, 'Token not found')
            }

            const update = await userService.updatePassword(user, password);
            console.log(update)
            if (! update) {
                return httpResponse.NotFound(res, 'Password not found')
            }

            res.clearCookie('tokenreset')

            return httpResponse.ok(res, update)

        } catch (error) {
            logguer.error(error)
        }
    }

    */
}
