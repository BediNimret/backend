const User = require("../model/user");
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
seedUsers();
