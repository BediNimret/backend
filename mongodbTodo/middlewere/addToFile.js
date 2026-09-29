const path = require("path");
const fs = require("fs");

function logger(req, res, next) {
  const log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
  const folderLocation = path.join(__dirname, "../logFiles/logDetails.txt");
  fs.appendFile(folderLocation, log, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });
  next();
}

exports.logger = logger;
