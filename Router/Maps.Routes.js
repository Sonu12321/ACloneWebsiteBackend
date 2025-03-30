import express from 'express'
import authUser from "../Middleware/authMiddleware.js";
// import getAddressCoordinates from '../Controller/MapsService.js'
import {getCoordinates, getLocationSuggestions, getLocationTime, getLocationTimeWithin} from '../Controller/MapsController.js'

const Router  = express.Router()

import { query } from 'express-validator';

Router. get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authUser,
    getCoordinates
);



Router.get(
    "/get-location-time",
    query("origin").isString().isLength({ min: 3 }).withMessage("Invalid origin"),
    query("destination").isString().isLength({ min: 3 }).withMessage("Invalid destination"),
    authUser,
    getLocationTimeWithin
);




Router. get('/get-suggestion',
    query('input').isString().isLength({ min: 3 }),
    
    authUser,
    getLocationSuggestions
);


export default Router
