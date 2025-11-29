import express from "express";
import sequelize from "./src/config/database.js";
const app = express();
const port = 3030;
app.use(express.json());

import "./src/models/Users.js";

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("databased synced successfully !");
  })
  .catch((err) => console.log("Error databased", err));

app.listen(port, () => {
  console.log(`server running on port ${port} `);
});
