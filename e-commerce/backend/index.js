const express = require("express");
require("dotenv").config();

const connectToDatabase = require("./connection/db");
const cors = require("cors");
const router = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const port = Number(process.env.PORT) || 8000;
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api/product", router);
app.use("/api/user", userRouter);

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`App is running on port - ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
