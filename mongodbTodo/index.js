const express = require("express");
const path = require("path");
const connectToDatabase = require("./connection/db");
const mongoose = require("mongoose");
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
app.get("/", async (req, res) => {
  const task = await mongoose.connection
    .useDb("todos")
    .collection("user_task")
    .find()
    .toArray();
  tasks = task;
  res.render("index", {
    completed: task.filter((t) => t.completed) || [],
    incomplete: task.filter((t) => !t.completed) || [],
  });
});
app.get("/api/tasks", async (req, res) => {
  const response = await mongoose.connection
    .useDb("todos")
    .collection("user_task")
    .find()
    .toArray();
  res.status(200).json(response);
});
app.put("/api/task/:id", async (req, res) => {
  try {
    const task = await mongoose.connection
      .useDb("todos")
      .collection("user_task")
      .find({ _id: new mongoose.Types.ObjectId(req.params.id) })
      .toArray();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await mongoose.connection
      .useDb("todos")
      .collection("user_task")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $set: { completed: !task.completed } },
      );

    res.status(200).json({ message: "Task status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error changing status" });
  }
});
app.delete("/api/task/:id", async (req, res) => {
  try {
    await mongoose.connection
      .useDb("todos")
      .collection("user_task")
      .deleteOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting task" });
  }
});
app.post("/api/createTask", async (req, res) => {
  try {
    await mongoose.connection.useDb("todos").collection("user_task").insertOne({
      id: req.body.id,
      name: req.body.name,
      completed: req.body.completed,
    });
    res.status(200).json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating task" });
  }
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
