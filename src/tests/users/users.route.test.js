import app from '../../server.js';
import request from 'supertest'
import mongoose from 'mongoose';
import { logguer } from '../../utils/logger.js';

describe('Test API USERS', () => {
 

  beforeAll(async () => { 
    await mongoose.connection.collections["users"].drop();
    logguer.info("se limpió la coleccion de usuarios");
    
  })

 test('[GET] /users/get-all', async () => {
   
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicoSporting@gmail.com",
        password: "12345",
        admin: true
    }
     
     const User = await request(app).post('/api/users/register').send(user)

    const idUser = User.body.newUser._id;     
    expect(idUser).toBeDefined();

    const userLogin = await request(app).post('/api/users/login').send(user)
    const token = userLogin.body.token;
    const id = userLogin.body.user._id;     
     expect(id).toBeDefined();
     expect(token).toBeDefined()
    
    const response = await request(app).get('/api/users/users/all-users').set('Authorization', `Bearer ${token}`);
     expect(response.statusCode).toBe(200);
     expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    
     
 });   
    
 test('[POST] /register', async()=>{
   
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nico@gmail.com",
        password: "12345",
        admin: true
    }
     
     const response = await request(app).post('/api/users/register').send(user)
       
        const id = response.body.newUser._id;
        const nombreUser = response.body.newUser.nombre;
        expect(id).toBeDefined();
        expect(response.body.newUser).toHaveProperty('_id');
        expect(nombreUser).toBe(user.nombre)
     
     
 });
  
test('[POST] /login', async () => {
   
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicoscs12@gmail.com",
        password: "12345",
        admin: true
    }
     
    await request(app).post('/api/users/register').send(user)
   
    const response = await request(app).post('/api/users/login').send(user)
    
    const id = response.body.user._id;
    const token = response.body.token;
    const nombreUser = response.body.user.nombre;
    const emailUser = response.body.user.email;
    const apellidoUser = response.body.user.apellido;;
    expect(nombreUser).toBe(user.nombre)
    expect(emailUser).toBe(user.email)
    expect(apellidoUser).toBe(user.apellido)
    expect(id).toBeDefined();
    expect(token).toBeDefined()

    
     
});
    
test('[GET] /id/:id', async () => {
   
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicoscs11111@gmail.com",
        password: "12345",
        admin: true
    }
     
    const newUser = await request(app).post('/api/users/register').send(user)
    const loginUser = newUser.body.newUser;
    const id = loginUser._id;

         
    const response = await request(app).get(`/api/users/id/${id}`)
    
    const idUser = response.body._id;
    const nombreUser = response.body.nombre;
    const emailUser = response.body.email;
    const apellidoUser = response.body.apellido;
    expect(idUser).toBeDefined();
    expect(nombreUser).toBe(user.nombre)
    expect(emailUser).toBe(user.email)
    expect(apellidoUser).toBe(user.apellido)
    
     
 });
  
  

})
