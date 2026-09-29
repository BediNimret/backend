const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: {
      type: String,
      required: [true, "Task is required"],
      trim: true,
      minlength: [1, "Task cannot be empty"],
      maxlength: [100, "Task cannot exceed 100 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const todo = mongoose.model("user_task", todoSchema);

module.exports = todo;
