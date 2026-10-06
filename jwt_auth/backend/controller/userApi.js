const userModel = require("../model/user");
const { setUser } = require("../service/auth");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionId = setUser({ _id: user._id, email: user.email });
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production with HTTPS
    });

    return res.json({
      message: "Login successful",
      data: { uid: sessionId },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function logout(req, res) {
  try {
    const sessionId = req.cookies?.sessionId || req.body?.sessionId;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    res.clearCookie("sessionId");

    return res.json({
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await userModel.create({ email, password });
    const sessionId = setUser({ _id: user._id, email: user.email });
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production with HTTPS
    });

    return res.json({
      message: "User registered successfully",
      data: { uid: sessionId },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { login, logout, register };
