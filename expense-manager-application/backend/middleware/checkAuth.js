const { getUser } = require("../services/auth");

function checkAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    req.user = getUser(token);
  } catch (err) {
    console.error("JWT verification failed:", err.name, err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

module.exports = checkAuth;
