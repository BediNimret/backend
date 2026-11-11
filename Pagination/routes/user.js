const getusers = require("../controller/user");
const getPost = require("../controller/post");
const express = require("express");
const router = express.Router();
router.route("/user").get(getusers);
router.route("/post").get(getPost);
module.exports = router;
