const path = require("path");
const fs = require("fs");

function logger(req, res, next) {
  const log = `${new Date().toISOString()} -Hostname: ${req.hostname} IP: ${req.ip} Method: ${req.method} URL: ${req.originalUrl}\n`;
  const folderLocation = path.join(__dirname, "../logFiles/log.txt");
  fs.appendFile(folderLocation, log, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });
  next();
}

exports.logger = logger;
