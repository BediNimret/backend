const getusers = require("../controller/user");
const express = require("express");
const router = express.Router();
router.route("/user").get(getusers);
module.exports = router;
