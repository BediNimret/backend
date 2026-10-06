function checkAuth(req, res, next) {
  const sessionid = req.cookies.sessionId;

  if (!sessionid) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

module.exports = checkAuth;
