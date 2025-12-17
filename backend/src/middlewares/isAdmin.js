import { AppError, asyncHandler } from "./errorHandler.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError("Utilisateur non authentifié", 401);
  }

  if (req.user.role !== "admin") {
    throw new AppError("Accès refusé. Rôle administrateur requis", 403);
  }

  next();
});
