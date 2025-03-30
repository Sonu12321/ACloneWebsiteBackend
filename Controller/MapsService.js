import axios from 'axios';
const getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        // console.log("Full API Response:", response.data); 
        // console.log("Loaded API Key:", process.env.GOOGLE_MAPS_API);
// <-- Add this line

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return { ltd: location.lat, lng: location.lng };
        } else {
            console.error("Geocoding API Error:", response.data);
            throw new Error(`Geocoding API error: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
};

// Example usage:
// getAddressCoordinates('1600 Amphitheatre Parkway, Mountain View, CA')
//     .then(coords => console.log(coords))
//     .catch(error => console.error(error));

export default getAddressCoordinates;
