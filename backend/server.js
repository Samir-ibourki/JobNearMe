import express from "express";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";
import "./src/models/index.js";
import seedData from "./src/seeders/seed.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();
const port = 3030;

//middlewars
app.use(cors());
app.use(express.json());

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

    await seedData();

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database error:", err);
  });
