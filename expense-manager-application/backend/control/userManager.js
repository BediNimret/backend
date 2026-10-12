const userModel = require("../model/user");
const { setUser } = require("../services/auth");
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = setUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({
      message: "Login successful",
      data: {
        token: token,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred while logging in" });
  }
}

async function register(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.create({ email, password });
    const token = setUser(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(201).json({
      message: "Registration successful",
      data: {
        token: token,
        email: user.email,
        id: user._id,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    return res
      .status(500)
      .json({ message: "An error occurred while registering" });
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return res.status(200).json({ message: "Logout successful" });
}

module.exports = { login, register, logout };
