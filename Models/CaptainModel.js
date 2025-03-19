import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const CaptainUserModel = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name should be more than 3 characters"],
            maxlength: [20, "First name should be less than 20 characters"]
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, "Last name should be more than 3 characters"],
            maxlength: [20, "Last name should be less than 20 characters"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: true,
        select: false // Ensure password is not selected by default
    },
    socketId: {
        type: String
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"
    },
    vehicle:{
        color:{
            type:String,
            required:true,

        },
        plate:{
            type:String,
            required:true,
        },
        capacity:{
            type:Number,
            required:true,

        },
        vehicleType:{
            type:String,
            required:true,
            enum:["car","motorcycle","auto"]
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number
        }
    }
})


CaptainUserModel.methods.generateCaptainToken = function(){
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: `${this.fullname.firstname} ${this.fullname.lastname}`
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    )
    return token
}

CaptainUserModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // Correctly checking if password is modified

    this.password = await bcrypt.hash(this.password, 10); // Hash and update this.password

    next();  
});

CaptainUserModel.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

CaptainUserModel.methods.refreshToken = async function () {
   return jwt.sign(
           {
               _id: this._id,
           },
           process.env.REFRESH_TOKEN_SECRET,
           { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
       );
}

const Captain = mongoose.model("Captain",CaptainUserModel)
export default Captain

