const mongoose = require("mongoose");
const userScheme = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    city: { type: String },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userScheme);
module.exports = User;
