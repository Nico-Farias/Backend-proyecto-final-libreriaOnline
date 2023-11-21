import { Schema, model } from 'mongoose'

export const ticketSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    productsInCart: {
        type: Array
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

export const TicketModel = model('ticket', ticketSchema)