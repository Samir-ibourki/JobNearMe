import axios from "axios";

/**
 * Converts a physical address to latitude and longitude using OpenStreetMap Nominatim API.
 * FREE - No API key or billing required!
 * @param {string} address
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const geocodeAddress = async (address) => {
  try {
    const searchQuery = address.toLowerCase().includes('morocco') || address.toLowerCase().includes('maroc')
      ? address
      : `${address}, Morocco`;
    
    console.log("🗺️ Geocoding address:", searchQuery);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: searchQuery,
          format: "json",
          limit: 1,
          countrycodes: "ma", 
          addressdetails: 1, 
        },
        headers: {
          "User-Agent": "JobNearMe/1.0",
        },
      }
    );

    console.log(
      "📍 Nominatim response:",
      response.data.length > 0 ? `Found: ${response.data[0].display_name}` : "Not found"
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      console.log("✅ Coordinates found:", { lat, lon, display_name });
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      console.error("❌ Geocoding failed: No results found for:", searchQuery);
      return null;
    }
  } catch (error) {
    console.error("❌ Error in geocoding service:", error.message);
    return null;
  }
};
