import app from '../../server.js';
import request from 'supertest'
import mongoose from 'mongoose';
import { logguer } from '../../utils/logger.js';




describe('Test API PRODUCTS', () => {
  beforeAll(async () => { 
    await mongoose.connection.collections["products"].drop();
    logguer.info("se limpió la coleccion de productos");  
  })

  beforeAll(async () => {
    await mongoose.connection.collections["users"].drop();
    logguer.info("se limpió la coleccion de users")
  })


  //GET ALL
 test('[GET] /', async()=>{
   
     const response = await request(app).get('/api/products/')
       
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
     
 });
  
  //CREAR NUEVO PRODUCTO
  test('[POST] /new-product' ,async () => {
   const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicoscs12@gmail.com",
        password: "12345",
        admin: true
    }
     
    await request(app).post('/api/users/register').send(user)
   
    const userLogin = await request(app).post('/api/users/login').send(user)
    const token = userLogin.body.token;

      const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
      }

        const response = await request(app).post('/api/products/new-product').send(product).set('Authorization', `Bearer ${token}`);
        const id = response.body._id;
        const titleResponse = response.body.title;
        expect(response.statusCode).toBe(200);
        expect(id).toBeDefined();
        expect(response.body).toHaveProperty('_id');
        expect(titleResponse).toBe(product.title)
    
  })

  //BUSCAR POR ID
  test('[GET] /id/:id', async () => {  
  
    const user = {
        nombre: "juan ",
        apellido: "farias",
        email: "nicos@correo.com",
        password: "12345",
        admin: true
    }
     
    await request(app).post('/api/users/register').send(user)
   
    const userLogin = await request(app).post('/api/users/login').send(user)
    const token = userLogin.body.token;

      const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
      }

    const response = await request(app).post('/api/products/new-product').send(product).set('Authorization', `Bearer ${token}`);
    const id = response.body._id;
    expect(id).toBeDefined()
    const prodId = await request(app).get(`/api/products/id/${id}`)
    console.log(prodId.body)
    
    const idProd = prodId.body._id;
    const titleProdId = prodId.body.title;
    expect(idProd).toBeDefined();
    expect(prodId.body).toHaveProperty('_id');
    expect(titleProdId).toBe(product.title)
  })
  

})

 