const mongoose = require("mongoose");

async function getConnection() {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;
  return mongoose.connect(connectionString, {
    dbName: "expense-manager-application",
  });
}

module.exports = getConnection;
