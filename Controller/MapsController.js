import { validationResult } from "express-validator";
import getAddressCoordinates from "./MapsService.js";
import axios from "axios";

export const getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await getAddressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

// export default getCoordinates


// export const getLocationTime = async (req, res) => {
//     try {
//         const { origin, destination } = req.query;

//         // Log received query parameters
//         console.log("Received Origin:", origin);
//         console.log("Received Destination:", destination);

//         if (!origin || !destination) {
//             return res.status(400).json({ message: "Origin and Destination are required" });
//         }

//         // Get coordinates for origin and destination
//         const originCoords = await getAddressCoordinates(origin);
//         const destinationCoords = await getAddressCoordinates(destination);

//         if (!originCoords || !destinationCoords) {
//             return res.status(404).json({ message: "Could not fetch coordinates" });
//         }

//         // Construct API request for Distance Matrix
//         const apiKey = process.env.GOOGLE_MAPS_API;
//         const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.ltd},${originCoords.lng}&destinations=${destinationCoords.ltd},${destinationCoords.lng}&key=${apiKey}`;

//         const response = await axios.get(url);
//         console.log("Distance Matrix Response:", response.data);

//         if (response.data.status !== "OK") {
//             return res.status(400).json({ message: "Error fetching distance data", error: response.data });
//         }

//         const distanceData = response.data.rows[0].elements[0];

//         if (distanceData.status !== "OK") {
//             return res.status(400).json({ message: "Error fetching distance details", error: distanceData });
//         }

//         // Extract time and distance
//         const travelTime = distanceData.duration.text;
//         const travelDistance = distanceData.distance.text;

//         res.status(200).json({
//             origin,
//             destination,
//             travelTime,
//             travelDistance,
//         });

//     } catch (error) {
//         console.error("Error in getLocationTime:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

export const getLocationTime = async (origin, destination) => {
    try {
        if (!origin || !destination) {
            throw new Error("Origin and Destination are required");
        }

        console.log("Received Origin:", origin);
        console.log("Received Destination:", destination);

        // Get coordinates
        const originCoords = await getAddressCoordinates(origin);
        const destinationCoords = await getAddressCoordinates(destination);

        if (!originCoords || !destinationCoords) {
            throw new Error("Could not fetch coordinates");
        }

        // Construct API request
        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.ltd},${originCoords.lng}&destinations=${destinationCoords.ltd},${destinationCoords.lng}&key=${apiKey}`;

        const response = await axios.get(url);
        console.log("Distance Matrix Response:", response.data);

        if (response.data.status !== "OK") {
            throw new Error("Error fetching distance data");
        }

        const distanceData = response.data.rows[0].elements[0];

        if (distanceData.status !== "OK") {
            throw new Error("Error fetching distance details");
        }

        return {
            travelTime: distanceData.duration.text,
            travelDistance: distanceData.distance.text,
            distance: distanceData.distance.value, // in meters
            duration: distanceData.duration.value, // in seconds
        };

    } catch (error) {
        console.error("Error in getLocationTime:", error.message);
        throw new Error(error.message);
    }
};


export const getLocationSuggestions = async (req, res) => {
    try {
        const { input } = req.query;

        // Log received query parameter
        console.log("Received Input for Suggestions:", input);

        if (!input) {
            return res.status(400).json({ message: "Input is required" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

        const response = await axios.get(url);
        console.log("Google Places API Response:", response.data);

        if (response.data.status !== "OK") {
            return res.status(400).json({ message: "Error fetching suggestions", error: response.data });
        }

        // Extract suggestions from the API response
        const suggestions = response.data.predictions.map(place => ({
            description: place.description,
            place_id: place.place_id
        }));

        res.status(200).json({ suggestions });

    } catch (error) {
        console.error("Error in getLocationSuggestions:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


 export const getLocationTimeWithin = async (req, res) => {
    try {
        const { origin, destination } = req.query;

        // Log received query parameters
        console.log("Received Origin:", origin);
        console.log("Received Destination:", destination);

        if (!origin || !destination) {
            return res.status(400).json({ message: "Origin and Destination are required" });
        }

        // Get coordinates for origin and destination
        const originCoords = await getAddressCoordinates(origin);
        const destinationCoords = await getAddressCoordinates(destination);

        if (!originCoords || !destinationCoords) {
            return res.status(404).json({ message: "Could not fetch coordinates" });
        }

        // Construct API request for Distance Matrix
        const apiKey = process.env.GOOGLE_MAPS_API;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.ltd},${originCoords.lng}&destinations=${destinationCoords.ltd},${destinationCoords.lng}&key=${apiKey}`;

        const response = await axios.get(url);
        console.log("Distance Matrix Response:", response.data);

        if (response.data.status !== "OK") {
            return res.status(400).json({ message: "Error fetching distance data", error: response.data });
        }

        const distanceData = response.data.rows[0].elements[0];

        if (distanceData.status !== "OK") {
            return res.status(400).json({ message: "Error fetching distance details", error: distanceData });
        }

        // Extract time and distance
        const travelTime = distanceData.duration.text;
        const travelDistance = distanceData.distance.text;

        res.status(200).json({
            origin,
            destination,
            travelTime,
            travelDistance,
        });

    } catch (error) {
        console.error("Error in getLocationTime:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
