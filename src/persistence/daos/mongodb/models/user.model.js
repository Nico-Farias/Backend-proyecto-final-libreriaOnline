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
        default: true
    },
    role: {
        type: String,
        default: 'user'
    },
    tokenReset: {
      type:String  
    },
    ultimaConexion: {
      type:Date
    },


    carts: [
        {
           _id:false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            qty: {
                type: Number

            }

        }
    ]
})

userSchema.pre('find', function () {
    this.populate('carts.product')
})


export const userModel = mongoose.model('User', userSchema)
