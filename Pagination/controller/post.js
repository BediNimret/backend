const Post = require("../model/posts");
const mongoose = require("mongoose");

const getPost = async (req, res) => {
  const limit = Number(req.query.limit ?? 5);
  const cursor = req.query.cursor;
  try {
    const filter = cursor
      ? { _id: { $gt: new mongoose.Types.ObjectId(cursor) } }
      : {};
    const result = await Post.find(filter).sort({ _id: 1 }).limit(limit);

    return res.status(200).json({
      result,
      nextCursor: result.at(-1)?._id.toString() ?? null,
    });
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

module.exports = getPost;
