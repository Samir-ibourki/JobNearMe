import { Job } from "../models/index.js";
import { Op } from "sequelize";

const fixJobCoordinates = async () => {
  try {
    // Find jobs without coordinates
    const jobsToFix = await Job.findAll({
      where: {
        [Op.or]: [
          { latitude: null },
          { longitude: null },
          { latitude: { [Op.eq]: 0 } },
          { longitude: { [Op.eq]: 0 } },
        ],
      },
    });

    console.log(`Found ${jobsToFix.length} jobs without coordinates`);

    if (jobsToFix.length === 0) {
      console.log("All jobs have coordinates. Nothing to fix.");
      return;
    }

    // Update each job with default coordinates based on city
    const cityCoordinates = {
      Casablanca: { lat: 33.5731, lng: -7.5898 },
      Rabat: { lat: 34.0209, lng: -6.8416 },
      Marrakech: { lat: 31.6295, lng: -7.9811 },
      Fes: { lat: 34.0181, lng: -5.0078 },
      Tangier: { lat: 35.7595, lng: -5.834 },
      Agadir: { lat: 30.4278, lng: -9.5981 },
    };

    for (const job of jobsToFix) {
      const coords = cityCoordinates[job.city] || cityCoordinates["Casablanca"];
      await job.update({
        latitude: coords.lat,
        longitude: coords.lng,
      });
      console.log(
        `Fixed job #${job.id}: "${job.title}" -> ${coords.lat}, ${coords.lng}`
      );
    }

    console.log(`\nSuccessfully fixed ${jobsToFix.length} jobs!`);
  } catch (error) {
    console.error("Error fixing job coordinates:", error);
  }
};

export default fixJobCoordinates;
