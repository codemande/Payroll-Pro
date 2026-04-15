import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js"
import Role from "../models/Role.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SignUp controller
const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed
    });

    await Profile.create({
      user: user._id,
      fullName
    });

    await Role.create({
      user: user._id,
      role: "admin"
    });

    res.json({ message: "User created" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// SignIn controller
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if(!user) {
    return res.status(400).json({ message: "Invalid credentials" })
  };

  const match = await bcrypt.compare(password, user.password);

  if(!match) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });

};

export {
  register,
  login
};