require("dotenv").config();
const connectToDatabase = require("./connection/db");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const todo = require("./model/todos");
const route = require("./routes/apiRoutes");
const cors = require("cors");
const app = express();
const port = 8000;
let tasks = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/api/todos", route);

app.get("/", async (req, res) => {
  const task = await todo.find();
  tasks = task;
  res.render("index", {
    completed: task.filter((t) => t.completed) || [],
    incomplete: task.filter((t) => !t.completed) || [],
  });
});
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
