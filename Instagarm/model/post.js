const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caption: { type: String, required: true, trim: true },
  hashtags: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["published", "draft", "archived"],
    default: "draft",
  },
  likesCount: { type: Number, default: 0, min: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
