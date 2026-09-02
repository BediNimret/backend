const console = require("console");
const http = require("http");
const fs = require("node:fs");
const server = http.createServer((req, res) => {
  res.write("<h1>Random Number Server</h1>\n");
  const date = new Date().toLocaleString();
  const ip = req.socket.remoteAddress;

  fs.appendFile(
    "server.txt",
    `Request received at ${date} from ${ip} \n`,
    (err) => {
      err && console.log("errors", err);
    },
  );
  const interval = setInterval(() => {
    let randomNum = Math.ceil(Math.random() * 100);
    res.write(`<p> Random Number: ${randomNum}</p>\n`);
  }, 200);
  setTimeout(() => {
    clearInterval(interval);
    res.end("<h3>Done sending random numbers!</h3>");
  }, 20000);
});

server.listen(8000, () => {
  fs.appendFile(
    "server.txt",
    `Server started at ${new Date().toLocaleString()}\n`,
    (err) => {
      err && console.log("errors", err);
    },
  );
  console.log("Server started");
});
