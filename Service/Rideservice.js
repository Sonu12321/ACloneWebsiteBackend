import { getLocationTime } from "../Controller/MapsController.js";
import rideModel from "../Models/RideModel.js";




export const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await getLocationTime(pickup, destination);

    console.log("distanceTime response:", distanceTime); // ✅ Debugging

    if (!distanceTime || distanceTime.distance === undefined || distanceTime.duration === undefined) {
        throw new Error("Invalid distance or duration data received.");
    }

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            ((distanceTime.distance / 1000) * perKmRate.auto) +
            ((distanceTime.duration / 60) * perMinuteRate.auto)
        ),
        car: Math.round(
            baseFare.car +
            ((distanceTime.distance / 1000) * perKmRate.car) +
            ((distanceTime.duration / 60) * perMinuteRate.car)
        ),
        moto: Math.round(
            baseFare.moto +
            ((distanceTime.distance / 1000) * perKmRate.moto) +
            ((distanceTime.duration / 60) * perMinuteRate.moto)
        )
    };

    console.log("Calculated Fare:", fare); // ✅ Debugging

    return fare;
};



// OTP Generator
function getOtp(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return otp;
}

// Ride Creation Service
export const createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required");
    }

    // Get fare details
    const fare = await getFare(pickup, destination);

    // Create ride in DB
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6), // Generate OTP
        fare: fare[vehicleType] // Get fare for selected vehicle type
    });

    return ride;
};
