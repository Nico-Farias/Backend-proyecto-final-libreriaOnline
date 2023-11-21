import mongoose from 'mongoose'
// import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    vendedor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',   
            }

})

// productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model('Product', productSchema)
