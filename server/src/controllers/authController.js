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

  res.cookie("token", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    // sameSite: "strict",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }).json({ 
    message: "Login successful",
    user: { id: user._id, email: user.email } 
  });

};

// Logout controller
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
  res.json({ message: "Logout successful" });
};

//Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const roleDoc = await Role.findOne({user: user._id});

    res.json({
      user: {
        ...user._doc,
        role: roleDoc ? roleDoc.role : "user"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
}

export {
  register,
  login,
  getMe,
  logout
};