import { body, query } from "express-validator";
import express from "express";
import {   createRides, getFareDetails } from "../Controller/RideController.js";
import authUser from "../Middleware/authMiddleware.js"; // Ensure this exists and works

const router = express.Router();

router.post(
    "/createRide",
    authUser, // Ensure user is authenticated
    body("pickup")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Pickup address must be between 3 and 100 characters"),
    body("destination")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Destination address must be between 3 and 100 characters"),
    body("vehicleType")
        .isString()
        .isIn(["auto", "car", "moto"])
        .withMessage("Invalid vehicle type. Choose from: auto, car, or moto."),
    createRides
);


router.get('/calculate-fare', getFareDetails);
export default router;
