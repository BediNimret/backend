const todos = require("../model/todos");
const { default: mongoose } = require("mongoose");
async function getTodos(req, res) {
  const response = await todos.find();
  res.status(200).json(response);
}
async function createTodos(req, res) {
  try {
    const { id, name, completed } = req.body;
    const response = await todos.create({ id, name, completed });
    res.status(201).json(response);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}
async function deleteTodos(req, res) {
  try {
    const response = await todos.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(response);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: err.message });
  }
}
async function updateTodos(req, res) {
  try {
    const task = await todos.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: err.message });
  }
}
module.exports = { getTodos, createTodos, deleteTodos, updateTodos };
