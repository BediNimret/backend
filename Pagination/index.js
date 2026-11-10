const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/user");
dotenv.config();
const app = express();
app.use(express.json());

const connectDB = require("./connect/db");
app.use("/api", router);
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });
