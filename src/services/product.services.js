import ProductDao from "../persistence/daos/mongodb/product.dao.js";
const ProdDao = new ProductDao();

export default class ProductService {


    getAll = async () => {
        try {
            const items = await ProdDao.getAll();
            return items;
        } catch (error) {
            console.log(error);
        }
    };

    getById = async (id) => {
        try {
            const item = await ProdDao.getById(id);
            if (! item) 
                return false;
             else 
                return item;
            


        } catch (error) {
            console.log(error);
        }
    };

    create = async (obj) => {
        try {
            const newItem = await ProdDao.create(obj);
            if (! newItem) 
                return false;
             else 
                return newItem;
            


        } catch (error) {
            console.log(error);
        }
    };

    update = async (id, obj) => {
        try {
            const item = await ProdDao.getById(id);
            if (! item) 
                return false;
             else 
                return await ProdDao.update(id, obj);
            


        } catch (error) {
            console.log(error);
        }
    };

    delete = async (id) => {
        try {
            const item = await ProdDao.getById(id);
            if (! item) 
                return false;
             else 
                return await ProdDao.delete(id);
            


        } catch (error) {
            console.log(error);
        }
    };

    filterCategory = async (categoria) => {
        try {
            await ProdDao.filterCategory(categoria)
        } catch (error) {
            console.log(error);
        }
     }


}
