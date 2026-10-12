const express = require("express");
const connect = require("./connection/db");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute");
const expenseRoutes = require("./routes/expenseRoute");
const checkAuth = require("./middleware/checkAuth");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api", userRoutes);
app.use("/api/expense", checkAuth, expenseRoutes);
const port = process.env.PORT || 5001;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("ERROR connecting to db:", err.message);
    process.exitCode = 1;
  });
