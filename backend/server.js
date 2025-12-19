import express from "express";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
const app = express();
const port = 3030;
app.use(express.json());

import "./src/models/index.js";

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("databased synced successfully !");
  })
  .catch((err) => console.log("Error databased", err));

app.listen(port, () => {
  console.log(`server running on port ${port} `);
});
