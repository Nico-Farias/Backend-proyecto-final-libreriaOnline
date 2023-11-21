import { TicketModel } from "./models/ticket.model.js";
import UserDao from "./user.dao.js";
import ProductDao from "./product.dao.js";
const prodDao = new ProductDao();
const userDao = new UserDao();

export default class TicketDao {
    
    async generateTicket(userId) {
        
        try {
            let amountAcc = 0;
            let producInCart = []
            const user = await userDao.getById(userId)

            if (!user) {
                return false;
            }

            for (const prod of user.carts) {
                const idProd = prod.product._id.toString()
                const prodDb = await prodDao.getById(idProd)
                
                if (prod.qty <= prodDb.stock) { 
                    const amount = prod.qty * prodDb.price;
                    amountAcc += amount;
                    producInCart.push(prodDb.title)
                }
            }

              const ticket = await TicketModel.create({
                code: `${
                    Math.random()
                      }`,
                productsInCart : producInCart,
                purchase_datetime: new Date().toLocaleString(),
                amount: amountAcc,
                purchaser: user.email
            });
            user.carts = [];
            user.save();
            return ticket; 
            
        } catch (error) {
           httpResponse.NotFound(error)
        }
    }

}