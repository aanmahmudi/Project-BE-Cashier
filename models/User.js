import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'cashier', 'employee'],
        default: 'employee',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt:{
        type: Number
    },
    updateAt:{
        type: Number
    }
},
{
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
})

Schema.plugin(mongoosePaginate)

export default mongoose.model('User', Schema)