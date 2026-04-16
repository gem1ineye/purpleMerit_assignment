import User from "../models/User.js";
import sanitizeUser from "../utils/sanitizeUser.js";

const buildUserFilters = ({ search, role, status }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  return query;
};

const listUsers = async ({ page = 1, limit = 10, search = "", role, status }) => {
  const filters = buildUserFilters({ search, role, status });
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    User.find(filters)
      .select("-password")
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filters)
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)) || 1
    }
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id)
    .select("-password")
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

const createUser = async ({ payload, actorId }) => {
  const password = payload.password || Math.random().toString(36).slice(-10);

  const existing = await User.findOne({ email: payload.email.toLowerCase() });
  if (existing) {
    const error = new Error("Email already exists");
    error.status = 400;
    throw error;
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
    password,
    createdBy: actorId,
    updatedBy: actorId
  });

  return sanitizeUser(user);
};

const updateUser = async ({ targetId, payload, actor }) => {
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (actor.role === "Manager" && targetUser.role === "Admin") {
    const error = new Error("Managers cannot edit Admin users");
    error.status = 403;
    throw error;
  }

  if (actor.role === "Manager" && payload.role === "Admin") {
    const error = new Error("Managers cannot assign Admin role");
    error.status = 403;
    throw error;
  }

  if (payload.email && payload.email !== targetUser.email) {
    const duplicate = await User.findOne({ email: payload.email.toLowerCase(), _id: { $ne: targetId } });
    if (duplicate) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }
  }

  Object.assign(targetUser, {
    ...payload,
    email: payload.email ? payload.email.toLowerCase() : targetUser.email,
    updatedBy: actor.id
  });

  await targetUser.save();

  return sanitizeUser(targetUser);
};

const deactivateUser = async ({ targetId, actorId }) => {
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  targetUser.status = "inactive";
  targetUser.updatedBy = actorId;
  await targetUser.save();

  return sanitizeUser(targetUser);
};

const getMyProfile = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    const error = new Error("Authenticated user not found");
    error.status = 404;
    throw error;
  }

  return user;
};

const updateMyProfile = async ({ id, payload }) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("Authenticated user not found");
    error.status = 404;
    throw error;
  }

  if (payload.name !== undefined) {
    user.name = payload.name;
  }

  if (payload.password) {
    user.password = payload.password;
  }

  user.updatedBy = id;

  await user.save();
  return sanitizeUser(user);
};

export { listUsers, getUserById, createUser, updateUser, deactivateUser, getMyProfile, updateMyProfile };
