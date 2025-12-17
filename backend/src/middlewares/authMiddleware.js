import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError, asyncHandler } from "./errorHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Accès refusé. Token manquant.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new AppError("Utilisateur non trouvé. Token invalide.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Token expiré. Veuillez vous reconnecter.", 401);
    }
    if (error.name === "JsonWebTokenError") {
      throw new AppError("Token invalide.", 401);
    }
    throw error;
  }
});
