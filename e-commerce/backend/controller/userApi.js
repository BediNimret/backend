const userModel = require("../model/user");
const uuid = require("uuid");
const { setUser, deleteUser } = require("../service/auth");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const sessionId = uuid.v4();
    res.cookie("sessionId", sessionId);
    setUser(sessionId, { ...user, uid: sessionId });
    res.json({
      message: "Login successful",
      data: { email, password, uid: sessionId },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function logout(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const removed = deleteUser(sessionId);

    if (!removed) {
      return res.status(404).json({ message: "User session not found" });
    }

    res.json({
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.create({ email, password });
    const sessionId = uuid.v4();
    res.cookie("sessionId", sessionId);
    setUser(sessionId, { ...user, uid: sessionId });
    res.json({
      message: "User registered successfully",
      data: { email, password, uid: sessionId },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { login, logout, register };
