import {connect} from "mongoose"
import { logguer } from "../utils/logger.js"

export const connectionDB = process.env.MONGO_URL;


export const conectarDB = async ()=>{
try {
    await connect(connectionDB)
    logguer.http('Conectado a la base de datos mongoDB - ClickBook')
} catch (error) {
   logguer.error(error)
}
}

