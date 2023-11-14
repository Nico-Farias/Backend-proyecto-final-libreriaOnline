import {connect} from "mongoose"

export const connectionDB = 'mongodb+srv://root:root@cluster1.jwkc8w3.mongodb.net/ClickBook'


try {
    await connect(connectionDB)
    console.log('Conectado a la base de datos mongoDB - ClickBook')
} catch (error) {
    console.log(error)
}
