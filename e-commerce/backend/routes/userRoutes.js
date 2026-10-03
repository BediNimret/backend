const express = require("express");
const routes = express.Router();
const { login, logout, register } = require("../controller/userApi");

routes.route("/login").post(login);
routes.route("/register").post(register);
routes.route("/logout").post(logout);

module.exports = routes;
