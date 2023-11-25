import { connect } from "mongoose";
import { logguer } from "../utils/logger.js";

// URL de conexión a la base de datos obtenida desde process.env.MONGO_URL
export const connectionDB = 'mongodb+srv://root:root@cluster1.jwkc8w3.mongodb.net/Testing'

export const conectarDbTesting = async () => {
    try {
        await connect(connectionDB);
        logguer.http('Conectado a la base de datos MongoDB - Testing ClickBook');
    } catch (error) {
        logguer.error(error);
    }
};
