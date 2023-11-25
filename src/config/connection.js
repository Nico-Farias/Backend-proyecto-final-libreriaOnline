import { connect } from "mongoose";
import { logguer } from "../utils/logger.js";
import UserDao from "../persistence/daos/mongodb/user.dao.js";


// URL de conexión a la base de datos obtenida desde process.env.MONGO_URL
export const connectionDB = 'mongodb+srv://root:root@cluster1.jwkc8w3.mongodb.net/ClickBook'

export const conectarDB = async () => {
    try {
        await connect(connectionDB);
        logguer.http('Conectado a la base de datos MongoDB - ClickBook');

        UserDao.startVerificarInactividad()
    } catch (error) {
        logguer.error(error);
    }
};
