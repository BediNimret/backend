const userModel = require("../model/user");
const postModel = require("../model/post");
const sessionModel = require("../model/session");
const createIndexUser = async () => {
  await userModel.collection.createIndex({ city: 1 });
  await userModel.collection.createIndex({ city: 1, gender: 1 });
  await sessionModel.collection.createIndex(
    { expiresAt: 1 },
    {
      expireAfterSeconds: 0,
    },
  );
};
// const dropIndexUser = async () => {
//   await userModel.collection.dropIndex("city_1");
//   await userModel.collection.dropIndex("city_1_gender_1");
//   await postModel.collection.dropIndex("hashtags_travel_partial");
//   await sessionModel.collection.dropIndex("expiresAt_1");
// };

// dropIndexUser();

const createIndexPost = async () => {
  await createIndexUser().catch((err) => {
    console.error("Failed to create indexes:", err);
  });
};
createIndexPost();

const getUser = async (req, res) => {
  try {
    const city = req.query.city || "Delhi";
    const gender = req.query.gender || "Other";
    const user = await userModel
      .find({
        city: { $eq: city },
        gender: { $eq: gender },
      })
      .explain("excutionStats");
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getPost = async (req, res) => {
  try {
    const hashtags = req.query.hashtags || "travel";
    const post = await postModel.find({
      hashtags: { $eq: hashtags },
    });
    return res.status(200).json({ post });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getSession = async (req, res) => {
  try {
    const session = await sessionModel.find();
    return res.status(200).json({ session });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getUser,
  getPost,
  getSession,
};
