import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 8000;

let users = [];
let user = null;
let error = "";
let match = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { user, error, match });
});

app.post("/register", (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    favColor: req.body.favColor,
  };
  users.push(newUser);
  res.redirect("/");
});

app.post("/getDetails", (req, res) => {
  const mail = req.body.email;
  const foundUser = users.find((val) => val.email === mail);

  if (foundUser) {
    match = true;
    user = foundUser;
    error = "";
  } else {
    match = false;
    user = null;
    error = "Incorrect Email";
  }

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`App is listening at port : ${port}`);
});
