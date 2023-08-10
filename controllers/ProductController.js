import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

const index = async (req, res) => {
    try{
        const products = await Product.find({ status: 'active' });

       if(!products) { throw { code: 500, message: "Get products failed" } }

        return res.status(200).json({
           status: true,
           total: products.length,
           products
        });    
    } catch (err){
       return res.status(err.code || 500 ).json({
           status: false,
            message: err.message
        });
    }
}

const store = async(req, res) => {
    try{
        //if(!req.body.title) { throw { code: 428, message: "Title is required"}}
        
        //is required fields
        if(!req.body.title) { throw { code: 428, message: "Title is required" } }
        if(!req.body.thumbnail) { throw { code: 428, message: "Thumbnail is required" } }
        if(!req.body.price) { throw { code: 428, message: "Price is required" } }
        if(!req.body.categoryId) { throw { code: 428, message: "CategoryId is required" } }

        //is product exist
        const productExist = await Product.findOne({ title: req.body.title });
        if(productExist) {throw { code: 428, message: "Product is exist" } }

        //is objectId
        if(!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
            throw { code: 500, message: 'CategoryId invalid'}
        }

        //is category exist
        const categoryExist = await Category.findOne({ title: req.body.categoryId });
        if(categoryExist) {throw { code: 428, message: "Category is exist" } }

        const newProduct = new Product({
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            price: req.body.price,
            categoryId: req.body.categoryId,
        });
        const product = await newProduct.save();
    
        if(!product) { throw { code: 500, message: "Store product failed" } }

        return res.status(200).json({
            status: true,
            product
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        });
    }
}

export { index, store };
