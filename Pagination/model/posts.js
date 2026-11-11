const mongoose = require("mongoose");
const postScheme = new mongoose.Schema(
  {
    User_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Caption: { type: String, required: true },
    Image_URL: { type: String, required: true },
  },
  { timestamps: true },
);
const Post = mongoose.model("POST", postScheme);
module.exports = Post;
