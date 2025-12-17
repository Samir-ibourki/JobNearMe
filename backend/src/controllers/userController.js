import User from "../models/User.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";

export const updateLocation = asyncHandler(async (req, res) => {
  const { city, latitude, longitude } = req.body;

  if (!city && (!latitude || !longitude)) {
    throw new AppError("Ville ou coordonnées GPS requises", 400);
  }

  const user = await User.findByPk(req.user.id);
  if (!user) throw new AppError("Utilisateur introuvable", 404);

  user.city = city || user.city;
  user.latitude = latitude || user.latitude;
  user.longitude = longitude || user.longitude;

  await user.save();

  res.json({
    success: true,
    message: "Localisation mise à jour",
    data: {
      city: user.city,
      latitude: user.latitude,
      longitude: user.longitude,
    },
  });
});
