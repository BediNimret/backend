const User = require("./model/user");
const Post = require("./model/posts");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const TOTAL_USERS = Number(process.argv[2]) || 100000;
const BATCH_SIZE = 1000;
const firstNames = [
  "Ashish",
  "Rahul",
  "Amit",
  "Rohit",
  "Ankit",
  "Vikas",
  "Ravi",
  "Karan",
  "Priya",
  "Neha",
  "Sneha",
  "Pooja",
  "Simran",
  "Anjali",
  "Kavita",
  "Riya",
];

const lastNames = [
  "Shukla",
  "Verma",
  "Gupta",
  "Singh",
  "Yadav",
  "Mishra",
  "Pandey",
  "Sharma",
  "Patel",
  "Kumar",
  "Agarwal",
  "Tiwari",
];
const cities = [
  "Delhi",
  "Mumbai",
  "Lucknow",
  "Prayagraj",
  "Kanpur",
  "Varanasi",
  "Jaipur",
  "Pune",
  "Bangalore",
];

const genders = ["Male", "Female", "Other"];
let insertedCount = 0;
let nextPostUserId = BigInt("0x6af34a59d4212a95a3a3d0a6");
const MAX_OBJECT_ID = (1n << 96n) - 1n;

const generateRandomUser = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${randomNumber}.${lastName.toLowerCase()}@example.com`;
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  return { name, email, gender, city };
};
const generateRandomPost = () => {
  if (nextPostUserId > MAX_OBJECT_ID) {
    throw new RangeError("Generated user ID exceeds the ObjectId range");
  }
  const User_ID = new mongoose.Types.ObjectId(
    nextPostUserId.toString(16).padStart(24, "0"),
  );
  nextPostUserId += 1n;
  const Caption = "This is a sample post " + User_ID;
  const Image_URL = "https://example.com/image.jpg";
  return { User_ID, Caption, Image_URL };
};
async function seedUsers() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "pagination",
    });
    console.log(`MongoDB connected: ${connect.connection.host}`);

    for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
      const size = Math.min(BATCH_SIZE, TOTAL_USERS - i);
      const users = Array.from({ length: size }, generateRandomUser);
      const uploadedUsers = await User.insertMany(users, { ordered: true });
      insertedCount += uploadedUsers.length;

      console.log(`Inserted: ${insertedCount}/${TOTAL_USERS}`);
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await mongoose.disconnect();
    console.log("discooected");
  }
}
async function seedPost() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "pagination",
    });
    console.log(`MongoDB connected: ${connect.connection.host}`);
    const posts = Array.from({ length: 19 }, generateRandomPost);
    const insertedPosts = await Post.insertMany(posts);
    console.log(`Inserted ${insertedPosts.length} posts`);
  } catch (err) {
    console.error("Failed to seed posts:", err);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
}
//seedUsers();
seedPost();
