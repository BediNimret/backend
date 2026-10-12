const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function setUser(user) {
  const response = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
  return response;
}
function getUser(id) {
  const response = jwt.verify(id, JWT_SECRET);
  return response;
}
module.exports = { setUser, getUser };
