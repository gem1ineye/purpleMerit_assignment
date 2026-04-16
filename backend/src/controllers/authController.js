import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sanitizeUser from "../utils/sanitizeUser.js";

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { name: identifier }]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "User account is inactive" });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = "User" } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      status: "active"
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
};

export { login, register };
