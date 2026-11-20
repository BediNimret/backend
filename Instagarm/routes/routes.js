const { getUser, getPost, getSession } = require("../controller/user");
const express = require("express");
const route = express.Router();

route.get("/user", getUser);
route.get("/post", getPost);
route.get("/session", getSession);

module.exports = route;
