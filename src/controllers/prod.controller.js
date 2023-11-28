import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
import ProductService from "../services/product.services.js";
import { emailDeleteProduct } from "../utils/email.js";
import { HttpResponse } from "../errors/http.response.js";
import { logguer } from "../utils/logger.js";
const ProdService = new ProductService()

export default class ProductController {


    getAll = async (req, res, next) => {
        try {
            const items = await ProdService.getAll({});
            res.json(items)
        } catch (error) {
            next(error.message);
        }
    };

    getById = async (req, res, next) => {
        try {
            const {id} = req.params;
            const item = await ProdService.getById(id);
            if (! item) 
                res.json({msg: 'Id not found'});
             else 
                res.json(item)

        } catch (error) {
            next(error.message);
        }
    };

    create = async (req, res, next) => {
        try {
            const newItem = await ProdService.create(req.body);
            if (! newItem) 
                res.json({msg: 'Validation error'})
             else 
                res.json(newItem)
            logguer.info(newItem)

        } catch (error) {
            next(error.message);
        }
    };

    update = async (req, res, next) => {
        try {
            const {id} = req.params;
            const item = await ProdService.getById(id);
            if (!item) {
                res.json({msg: 'Item not found'})
            }else {
                const itemUpd = await ProdService.update(id, req.body);
                res.json({msg: 'Items update', itemUpd})
            logguer.info(itemUpd)
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
            const { vendedor } = item;
            const {_id} = vendedor;

            const infoVendedor = await userModel.findById({_id})

            if (! item) 
                res.json({msg: 'Item not found'})

            else {
                
                emailDeleteProduct({
                    nombreProducto: item.title,
                    emailVendedor: infoVendedor.email,
                    nombreVendedor: infoVendedor.nombre
                })

                logguer.info('Email enviado correctamente')
                const itemDel = await ProdService.delete(id);
                res.json({ msg: 'Items update', itemDel })
                logguer.info(itemDel)

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
