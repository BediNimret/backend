const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY;

const setUser = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secretKey,
    { expiresIn: "1h" },
  );
};

const getUser = (id) => {
  return jwt.verify(id, secretKey);
};

module.exports = { setUser, getUser };
