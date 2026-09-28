const mongoose = require("mongoose");
const MONGO_URI =
  "mongodb://nimretbedi_db_user:nimay1528@ac-0ssa2do-shard-00-00.aoepqhy.mongodb.net:27017,ac-0ssa2do-shard-00-01.aoepqhy.mongodb.net:27017,ac-0ssa2do-shard-00-02.aoepqhy.mongodb.net:27017/?ssl=true&replicaSet=atlas-frxh1c-shard-0&authSource=admin&appName=Cluster0";
async function connectToDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
}

module.exports = connectToDatabase;
