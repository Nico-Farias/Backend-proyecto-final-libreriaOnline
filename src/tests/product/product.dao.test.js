import mongoose from 'mongoose';
import { logguer } from '../../utils/logger.js';
import assert from 'node:assert'
import test from 'node:test'
import ProductDao from '../../persistence/daos/mongodb/product.dao.js';
import { conectarDbTesting } from '../../config/connectionDbTesting.js';

const prodDao = new ProductDao()

conectarDbTesting()

await mongoose.connection.collections["products"].drop();
logguer.info("se limpió la coleccion de productos");

test("Deberia mostrar todos los productos de la base de datos", async () => {
    const response = await prodDao.getAll();
    assert.equal(Array.isArray(response), true)

})


test("Deberia crear un producto", async () => {
   const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
}

    const response = await prodDao.create(product)

    assert.strictEqual(typeof product.title === "string", true)
    assert.strictEqual(typeof product.categoria === "string", true)
    assert.strictEqual(typeof product.stock === "number", true)
    assert.strictEqual(typeof product.price === "number", true)
    assert.ok(response, "_id")


})

test("Deberia buscar un product por Id", async () => {
 const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
}

    const response = await prodDao.create(product)
    const responseId = response._id.toString()
    const NewProd = await prodDao.getById(response._id)
    const NewProductId = NewProd._id.toString()
    assert.equal(NewProductId, responseId)

})

test('Debería actualizar un producto', async () => {
     const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
}  

    const prodAct = {
        title: "Camiseta boca juniors actualizado",
    };
    const response = await prodDao.create(product)
    const prodUpd = await prodDao.update(response._id ,prodAct);
    assert.equal(prodUpd.title,prodAct.title);
    assert.equal(prodUpd.body,prodAct.body);
    assert.equal(prodUpd.author,prodAct.author);
  });
  

test('Debería eliminar un documento', async () => {
      
      const product = {
        title: "Camiseta boca juniors",
        categoria: "Historia",
        stock: 10,
        price: 32000,
        image: "http://sdfsdf.com/sdfsdf.jpg"
    }  
    
   const response = await prodDao.create(product)
    const prodEliminado = await prodDao.delete(response._id);
    assert.equal(prodEliminado.title,product.title);
    assert.equal(prodEliminado.body,product.body);
    assert.equal(prodEliminado.author,product.author);
  })
