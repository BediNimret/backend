const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  const date = new Date().toLocaleString();
  const ip = req.socket.remoteAddress;
  const myURL = url.parse(req.url, true);

  switch (myURL.pathname) {
    case "/":
      const userName = myURL.query.username;
      res.end(`<h1>Hello, ${userName}</h1>`);
      break;

    case "/profile":
      res.end("You are in profile page");
      break;

    case "/home":
      res.end("You are in home page");
      break;

    case "/search":
      fs.appendFile(
        "log.txt",
        `Timestamp=${date} URL=${req.url} Parameters=${JSON.stringify(myURL.query)}\n`,
        (err) => {
          if (err) console.error("Error writing to log file:", err);
        },
      );
      res.end(`<p>Search query: ${myURL.query.username}</p>`);
      break;

    default:
      res.end("404 page not found");
  }

  fs.appendFile(
    "server.txt",
    `Request received at ${date} from ${ip}\n`,
    (err) => {
      if (err) console.error("Error writing to server log:", err);
    },
  );
});

server.listen(8000, () => {
  const startTime = new Date().toLocaleString();
  fs.appendFile("server.txt", `Server started at ${startTime}\n`, (err) => {
    if (err) console.error("Error writing server start log:", err);
  });
  console.log("Server started");
});
