import User from "../Models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authUser = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)
    req.user = user

    return next()
    }
    catch(err){
        return res.status(401).json({message:"invalid user"})    }
}

export default authUser