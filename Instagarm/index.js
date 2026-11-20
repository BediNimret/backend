const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./connection/db");
const routes = require("./routes/routes");

app.use(express.json());
app.use("/api", routes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });
