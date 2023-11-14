import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        index: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    admin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },


    carts: [
        {
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            qty: {
                type: Number

            }

        }
    ]
})

userSchema.pre('find', function () {
    this.populate('products')
})


export const userModel = mongoose.model('users', userSchema)
