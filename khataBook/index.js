import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filesDir = path.join(__dirname, "files");

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const getFileNames = () =>
  fs.readdirSync(filesDir).filter((file) => file.endsWith(".txt"));

app.get("/", (req, res) => {
  const files = getFileNames();
  res.render("index", { files, data: "" });
});

app.post("/createFile", (req, res) => {
  const name = req.body.fileName.trim();
  if (!name) return res.redirect("/");

  const filePath = path.join(filesDir, `${name}.txt`);
  fs.writeFile(filePath, "", (err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/readFile/:fileName", (req, res) => {
  const fileName = req.params.fileName.replace(/\.txt$/, "");
  const filePath = path.join(filesDir, `${fileName}.txt`);

  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ data: fileData });
  });
});

app.post("/saveFile/:fileName", (req, res) => {
  const filePath = path.join(filesDir, `${req.params.fileName}`);
  const content = req.body.content || "";

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ message: "Save failed" });
    }

    return res.status(200).json({ message: "Saved successfully" });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
