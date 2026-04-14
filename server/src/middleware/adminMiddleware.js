import Role from "../models/Role.model.js";

const isAdmin = async (req, res, next) => {

  const role = await Role.findOne({
    user: req.user.id,
    role: "admin"
  });

  if (!role) {
    return res.status(403).json({ message: "Admin Only" });
  }

  next();
};

export default isAdmin;