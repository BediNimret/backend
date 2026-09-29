const mongoose = require("mongoose");
async function connectToDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing from .env");

  await mongoose.connect(uri, { dbName: "todos" });
  console.log("Connected to MongoDB");
}

module.exports = connectToDatabase;
