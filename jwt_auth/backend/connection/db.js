const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    return connect;
  } catch (err) {
    console.log(err);
    return err;
  }
}
module.exports = connectToDatabase;
