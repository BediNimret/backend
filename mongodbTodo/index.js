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
const taskSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true },
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
      minlength: [1, "Task name cannot be empty"],
      maxlength: [100, "Task name cannot exceed 100 characters"],
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const todo = mongoose.model("user_task", taskSchema);
app.get("/", async (req, res) => {
  const task = await todo.find();
  tasks = task;
  res.render("index", {
    completed: task.filter((t) => t.completed) || [],
    incomplete: task.filter((t) => !t.completed) || [],
  });
});
app.get("/api/tasks", async (req, res) => {
  const response = await todo.find();
  res.status(200).json(response);
});
app.put("/api/task/:id", async (req, res) => {
  try {
    const task = await todo.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await todo.updateOne(
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
    await todo.deleteOne({
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
    const task = new todo(req.body);
    await task.validate();
    await todo.insertOne({
      ...task.toObject(),
    });
    res.status(200).json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    }
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
