// import User from "../Models/UserModel.js";
import Captain from '../Models/CaptainModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authCaptain = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const captain = await Captain.findById(decoded._id)
    req.captain = captain

    return next()
    }
    catch(err){
        return res.status(401).json({message:"invalid user"})    }
}

export default authCaptain