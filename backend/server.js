import express from "express";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";
import "./src/models/index.js";
import seedData from "./src/seeders/seed.js";
import fixJobCoordinates from "./src/seeders/fixJobCoordinates.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

const app = express();
const port = process.env.PORT || 3030;

//middlewares
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "JobNearMe API is running",
    documentation: "/api-docs",
    timestamp: new Date().toISOString()
  });
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

//error handler
app.use(errorHandler);

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database synced successfully!");

    // Run seeders only in development mode
    if (process.env.NODE_ENV !== 'production') {
      await seedData();
      await fixJobCoordinates();
    }

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Database error:", err);
  });
