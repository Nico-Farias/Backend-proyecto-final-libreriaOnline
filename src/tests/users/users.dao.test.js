import mongoose from 'mongoose';
import { logguer } from '../../utils/logger.js';
import UserDao from '../../persistence/daos/mongodb/user.dao.js';
const userDao = new UserDao();
import assert from 'node:assert'
import test from 'node:test'
import { conectarDbTesting } from '../../config/connectionDbTesting.js';

conectarDbTesting()

await mongoose.connection.collections["users"].drop();
logguer.info("se limpió la coleccion de usuarios");

test("Deberia mostrar todos los usuarios de la base de datos", async () => {
    const response = await userDao.getAll()
    assert.equal(Array.isArray(response), true)

})

test("Deberia crear un usuario", async () => {
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicoscs@gmail.com",
        password: "12345",
        admin: true

    }

    const response = await userDao.register(user)

    assert.strictEqual(typeof user.nombre === "string", true)
    assert.strictEqual(typeof user.apellido === "string", true)
    assert.strictEqual(typeof user.email === "string", true)
    assert.strictEqual(typeof user.password === "string", true)


})

test("Deberia buscar un user por Id", async () => {
   const user = {
        nombre: "juan carlos",
        apellido: "farias",
        email: "nicoscs12@gmail.com",
        password: "12345",
        admin: true

    }

    const response = await userDao.register(user)
const responseId = response._id.toString()
    assert.equal(response.nombre, user.nombre) 
    
    const NewUser = await userDao.getById(response._id)
    
    assert.equal(NewUser.nombre, user.nombre)
    assert.equal(NewUser.apellido, user.apellido)
    assert.equal(NewUser.email, user.email)
    const NewUserId = NewUser._id.toString()
    assert.equal(NewUserId, responseId)

})

test("Deberia hacer login", async () => {

    const newUser = {
        nombre: "juan carlos",
        apellido: "farias",
        email: "nicoscs12@gmail.com",
        password: "12345"
    }

    await userDao.register(newUser)


    const userLogin = {
        email: "nicoscs12@gmail.com",
        password: "12345"

    }

    const response = await userDao.login(userLogin)

    assert.equal(userLogin.email, response.email)
    assert.strictEqual(typeof userLogin.email === "string", true)
    assert.strictEqual(typeof userLogin.password === "string", true)


})


test('Debería actualizar un usuario', async()=>{
     const user = {
        nombre: "juan",
        apellido: "farias",
        email: "nico12@gmail.com",
        password: "12345"
    }
      
      const user2 = {
        nombre: "juan carlos Actualizado",
        apellido: "farias Actualizado",
    };
    const response = await userDao.register(user);
    const userUpd = await userDao.update(response._id, user2);
    assert.equal(userUpd.nombre, user2.nombre);
    assert.equal(userUpd.apellido, user2.apellido);
    
});

