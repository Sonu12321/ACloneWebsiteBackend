import User from "../Models/UserModel.js";
import express from "express";

const userRegister = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if ([firstname, lastname, email, password].some((field) => !field?.trim())) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        const existUser = await User.findOne({
            $or: [
                { "fullname.firstname": firstname, "fullname.lastname": lastname },
                { email },
            ],
        });

        if (existUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        const user = await User.create({
            fullname: { firstname, lastname },
            email,
            password,
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            token,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email and password" });
        }

        console.log("Stored Hashed Password:", user.password);
        console.log("Entered Password:", password);

        const checkPassword = await user.comparePassword(password);
        console.log("Password Match:", checkPassword);

        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid email and password" });
        }

        const token = user.generateAuthToken();
        res.cookie('token',token)

        res.status(200).json({ token, user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const ShowUserProfile = (req,res) =>{
    return res.status(200).json(req.user)
}



export { userRegister,LoginUser,ShowUserProfile };
