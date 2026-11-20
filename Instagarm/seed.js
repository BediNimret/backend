require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./model/user");
const Post = require("./model/post");
const Session = require("./model/session");

const seedUsers = [
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000009"),
    name: "Avery Morgan",
    email: "avery5.seed@example.com",
    gender: "Other",
    city: "Delhi",
    age: 30,
    isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000010"),
    name: "Jordan Lee",
    email: "jordan6.seed@example.com",
    gender: "Female",
    city: "Aurangabad",
    age: 40,
    isActive: true,
  },
];

const seedPosts = [
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000107"),
    userId: seedUsers[0]._id,
    caption: "A sunny day by the water",
    hashtags: ["travel", "ocean"],
    status: "published",
    likesCount: 24,
    isDeleted: false,
  },
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000107"),
    userId: seedUsers[1]._id,
    caption: "A little city exploring",
    hashtags: ["travel", "weekend"],
    status: "draft",
    likesCount: 0,
    isDeleted: false,
  },
];

const seedSessions = [
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000209"),
    userId: seedUsers[0]._id,
    token: "seed-session-avery-not-for-authentication",
    expiresAt: new Date("2026-11-20T00:21:46.000Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("673000000000000000000210"),
    userId: seedUsers[1]._id,
    token: "seed-session-jordan-not-for-authentication",
    expiresAt: new Date("2026-11-20T21:45:00.000Z"),
  },
];

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI, { dbName: "instagarm" });
  try {
    for (const user of seedUsers) {
      const { _id, ...userFields } = user;
      await User.updateOne(
        { _id },
        { $set: userFields },
        { upsert: true, runValidators: true },
      );
    }

    await Post.bulkWrite(
      seedPosts.map((post) => ({
        updateOne: {
          filter: { _id: post._id },
          update: { $set: post },
          upsert: true,
        },
      })),
    );

    await Session.bulkWrite(
      seedSessions.map((session) => ({
        updateOne: {
          filter: { _id: session._id },
          update: { $set: session },
          upsert: true,
        },
      })),
    );

    console.log("Seeded users, posts, and sessions.");
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exitCode = 1;
});
