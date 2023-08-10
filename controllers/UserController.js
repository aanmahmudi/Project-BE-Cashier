import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { isEmailExist, isEmailExistWithUserId } from '../libraries/isEmailExist.js'


const index = async (req, res) => {
    try{

        let find = {
            fullname: { $regex: `^${req.query.search}` , $options: 'i' }
        }

        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        const users = await User.paginate(find, options);
        if(!users) { throw { code: 404, message: "USER_NOT_FOUND" }}

        return res.status(200).json({
            status: true,
            total: users.length,
            users
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        })
    }
}


const store = async(req, res) => {
    try{
        if(!req.body.fullname) { throw { code: 428, message: "Fullname is required"}}
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.password) { throw { code: 428, message: "Password is required"}}
        if(!req.body.role) { throw { code: 428, message: "Role is required"}}

        
        //check if password match
        if(req.body.password !== req.body.retype_password) {
            throw { code: 428, message: "PASSWORD_NOT_MATCH" }
        }

        //check is email exist
        const email = await isEmailExist( req.body.email );
        if(email) { throw { code: 409, message: "EMAIL_EXIST" } }
        
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            role: req.body.role,
            password: hash,
            
        });
        const user = await newUser.save();
    
        if(!user) { throw { code: 500, message: "USER_RESGISTER_FAILED" } }

        return res.status(200).json({
            status: true,
            message: 'USER_REGISTER_SUCCESS',
            user
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        });
    }
}

const show = async (req, res) => {
    try{
        if(!req.params.id) { throw { code: 428, message: "ID is required" } }

        const user = await User.findById(req.params.id)
        if(!user) { throw { code: 404, message: "USER_NOT_FOUND" }}
    
        return res.status(200).json({
            status: true,
            user
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        })
    }
}

const update = async(req, res) => {
    try{
        if(!req.params.id) { throw { code: 428, message: "ID is required" } }
        if(!req.body.fullname) { throw { code: 428, message: "Fullname is required"}}
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.role) { throw { code: 428, message: "Role is required"}}

        
        //check if password match
        if(req.body.password !== req.body.retype_password) {
            throw { code: 428, message: "PASSWORD_NOT_MATCH" }
        }

        //check is email exist
        const email = await isEmailExistWithUserId( req.params.id, req.body.email );
        if(email) { throw { code: 409, message: "EMAIL_EXIST" } }
        
        let fields = {}
        fields.fullname = req.body.fullname
        fields.email = req.body.email
        fields.role = req.body.role

        if(req.body.password) {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt);
            fields.password = hash
        }

        //update user
        const user = await User.findByIdAndUpdate(req.params.id, fields, { new : true });
    
        if(!user) { throw { code: 500, message: "USER_UPDATE_FAILED" } }

        return res.status(200).json({
            status: true,
            message: 'USER_UPDATE_SUCCESS',
            user
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        });
    }
}

const destroy = async(req, res) => {
    try{
        if(!req.params.id) { throw { code: 428, message: "ID is required" } }

        //update user
        const user = await User.findByIdAndDelete(req.params.id);
    
        if(!user) { throw { code: 500, message: "USER_DELETE_FAILED" } }

        return res.status(200).json({
            status: true,
            message: 'USER_DELETE_SUCCESS',
            user
        });
    } catch (err){
        return res.status(err.code || 500 ).json({
            status: false,
            message: err.message
        });
    }
}


export { index, store, update, show, destroy }
