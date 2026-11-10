const User = require("../model/user");

const getUsers = async (req, res) => {
  const page = Number(req.body.page ?? 1);
  const limit = Number(req.body.limit ?? 50);

  const skip = (page - 1) * limit;

  try {
    const [totalUser, result] = await Promise.all([
      User.countDocuments(),
      User.find().skip(skip).limit(limit),
    ]);

    return res.status(200).json({
      result,
      totalUsers: totalUser,
      totalPages: Math.ceil(totalUser / limit),
      page,
      limit,
    });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

module.exports = getUsers;
