import Role from "../models/Role.model.js";

const isAdmin = async (req, res, next) => {

  try {
    const role = await Role.findOne({
      user: req.user.id,
      role: "admin"
    });

    if (!role) {
      return res.status(403).json({ message: "Admin Only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default isAdmin;