import Captain from "../Models/CaptainModel.js";

const RegisterCaptain = async(req,res) =>{
try {
        const {firstname,lastname,password,email,color,plate,capacity,vehicleType} = req.body
    
        if ([firstname, lastname, password, email, color, plate, capacity, vehicleType].some(field => !field || !field.toString().trim())) {
            return res.status(401).json({ message: "Please fill in all fields" });
        }
        
    
        const existCaptainUser = await Captain.findOne({
            $or:[
                {
                    email:email
                },{
                    "fullname.firstname" :firstname ,"fullname.lastname":lastname
                }
            ]
        })
    
        if(existCaptainUser){
            return res.status(401).json({
                message: "Captain already exists",
            })
        }
    
        const CaptainUser =await Captain.create({
            fullname:{
                firstname:firstname,
                lastname:lastname
                },
            email,
            password,
            vehicle: {
                color,
                plate,
                capacity,
                vehicleType
            }
            
        })
    
        const token = CaptainUser.generateCaptainToken()
        res.status(201).json({
            _id: CaptainUser._id,
                fullname: CaptainUser.fullname,
                email: CaptainUser.email,
                color: CaptainUser.color,
                plate: CaptainUser.plate,
                capacity: CaptainUser.capacity,
                vehicleType: CaptainUser.vehicleType,
                token:token
        })
} catch (error) {
    res.status(500).json({
        error: error.message,
    });
}
} 

const LoginCaptain = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fix condition: Either email or password missing should return an error
        if (!email || !password) {
            return res.status(401).json({ message: "Email and password are required" });
        }

        // Find the captain user with the email
        const CaptainUser = await Captain.findOne({ email }).select("+password");

        if (!CaptainUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if password matches
        const checkPassword = await CaptainUser.comparePassword(password);
        console.log("Password Match:", checkPassword);

        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = CaptainUser.generateCaptainToken();

        // Set token in cookie (ensure cookie-parser is used in your app)
        res.cookie("token", token);

        // Send response
        res.status(200).json({ token, CaptainUser });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const ShowUserProfileCaptain = (req,res) =>{
    return res.status(200).json(req.captain)
}

export {RegisterCaptain,LoginCaptain,ShowUserProfileCaptain}