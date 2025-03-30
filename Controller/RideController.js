import { validationResult } from "express-validator";
import {createRide, getFare} from '../Service/Rideservice.js'
// import getAddressCoordinates from "./MapsService.js";
import rideModel from "../Models/RideModel.js";

export const createRides = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json({ message: "Ride completed", ride });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};


export const getFareDetails = async (req, res) => {
    try {
        const { pickup, destination } = req.query;

        if (!pickup || !destination) {
            return res.status(400).json({ error: 'Pickup and destination are required' });
        }

        const fare = await getFare(pickup, destination);

        res.status(200).json({ success: true, fare });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
