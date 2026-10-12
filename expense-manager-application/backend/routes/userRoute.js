const express = require("express");
const routes = express.Router();
const { login, register, logout } = require("../control/userManager");

routes.route("/register").post(register);
routes.route("/login").post(login);
routes.route("/logout").post(logout);

module.exports = routes;
