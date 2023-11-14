import ProductService from "../services/product.services.js";
const ProdService = new ProductService()

export default class ProductController {


    getAll = async (req, res, next) => {
        try {
            const items = await ProdService.getAll({});
            res.status(200).json(items)
        } catch (error) {
            next(error.message);
        }
    };

    getById = async (req, res, next) => {
        try {
            const {id} = req.params;
            const item = await ProdService.getById(id);
            if (! item) 
                res.status(404).json({msg: 'Id not found'});
             else 
                res.status(200).json(item)

        } catch (error) {
            next(error.message);
        }
    };

    create = async (req, res, next) => {
        try {
            const newItem = await ProdService.create(req.body);
            if (! newItem) 
                res.status(402).json({msg: 'Validation error'})
             else 
                res.status(200).json(newItem)


            


        } catch (error) {
            next(error.message);
        }
    };

    update = async (req, res, next) => {
        try {
            const {id} = req.params;
            const item = await ProdService.getById(id);
            if (!item) {
                res.status(404).json({msg: 'Item not found'})
            }else {
                const itemUpd = await ProdService.update(id, req.body);
                res.status(200).json({msg: 'Items update', itemUpd})

            }
        } catch (error) {
            console.log(error)
            next(error.message);
        }
    };

    delete = async (req, res, next) => {
        try {
            const {id} = req.params;
            const item = await ProdService.getById(id);
            if (! item) 
                res.status(402).json({msg: 'Item not found'})

             else {
                const itemDel = await ProdService.delete(id);
                res.status(200).json({msg: 'Items update', itemDel})

            }
        } catch (error) {
            next(error.message);
        }
    };

    filterCategory = async (req, res, next) => { 
        try {
            const { categoria } = req.query;
            const response = await ProdService.filterCategory(categoria)
             res.json({response})

        } catch (error) {
            next(error.message);
        }
    }


}
