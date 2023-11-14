import { TicketModel } from "./models/ticket.model";
import UserDao from "./user.dao";
import ProductDao from "./product.dao";
const prodDao = new ProductDao();
const userDao = new UserDao();

export default class TicketDao {
    
    async generateTicket(userId) {
        
        try {
            let amountAcc = 0;

            const user = await userDao.getById(userId)

            if (!user) {
                return false;
            }

            for (const prod of user.carts) {
                const idProd = prod._id.toString()
                const prodDb = await prodDao.getById(idProd)

                if (prod.qty <= prodDb.stock) { 
                    const amount = prod.qty * prodDB.price;
                    amountAcc += amount;
                }
            }

              const ticket = await TicketModel.create({
                    code: `${
                    Math.random()
                }`,
                purchase_datetime: new Date().toLocaleString(),
                amount: amountAcc,
                purchaser: user.email
            });
            user.carts = [];
            user.save();
            return ticket; 
            
        } catch (error) {
            console.log(error)
        }
    }

}