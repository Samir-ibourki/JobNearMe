import axios from "axios";

/**
 * Converts a physical address to latitude and longitude using OpenStreetMap Nominatim API.
 * FREE - No API key or billing required!
 * @param {string} address
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const geocodeAddress = async (address) => {
  try {
    console.log("🗺️ Geocoding address:", address);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "JobNearMe/1.0",
        },
      }
    );

    console.log(
      "📍 Nominatim response:",
      response.data.length > 0 ? "Found" : "Not found"
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      console.log("✅ Coordinates found:", { lat, lon });
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.error("❌ Geocoding failed: No results found");
      return null;
    }
  } catch (error) {
    console.error("❌ Error in geocoding service:", error.message);
    return null;
  }
};
