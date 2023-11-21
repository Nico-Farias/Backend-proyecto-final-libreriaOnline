import { ProductModel } from './models/product.model.js';
import { HttpResponse } from '../../../errors/http.response.js';
const httpResponse = new HttpResponse();


export default class ProductDao {


    async create(obj) {
        try {
            const response = await ProductModel.create(obj)
            return response
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async getAll() {
        try {
            const response = await ProductModel.find({})
            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async getByEmail(email) {
        try {
            const response = await ProductModel.findOne({email})
            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }

    async getById(id) {
        try {
            const response = await ProductModel.findById(id);
            return response;
        } catch (error) {
            httpResponse.NotFound(error);
        }
    }

    async update(id, obj) {
        try {
            await ProductModel.updateOne({
                _id: id
            }, obj);
            return obj;
        } catch (error) {
            httpResponse.NotFound(error);
        }
    }

    async delete(id) {
        try {
            const response = await ProductModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            httpResponse.NotFound(error);
        }
    }

    async filterCategory(categoria) {
        try {
            const response = await ProductModel.aggregate([{
                $match: {
                    categoria:`${categoria}`
                }
            },])

            return response;
        } catch (error) {
            httpResponse.NotFound(error)
        }
    }


}
