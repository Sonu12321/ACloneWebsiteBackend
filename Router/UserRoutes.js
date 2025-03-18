import express from "express";
import {LoginUser, ShowUserProfile, userRegister} from '../Controller/UserController.js';
import authUser from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",userRegister);
router.post("/Login",LoginUser);
router.get('/Profile',authUser,ShowUserProfile)
export default router;
