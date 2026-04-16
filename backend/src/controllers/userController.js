import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  getMyProfile,
  updateMyProfile
} from "../services/userService.js";

const getMe = async (req, res, next) => {
  try {
    const user = await getMyProfile(req.user.id);
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

const putMe = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      password: req.body.password
    };

    const user = await updateMyProfile({ id: req.user.id, payload });
    return res.json({ success: true, data: user, message: "Profile updated" });
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const data = await listUsers(req.query);
    return res.json({ success: true, ...data });
  } catch (error) {
    return next(error);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const user = await createUser({
      payload: req.body,
      actorId: req.user.id
    });

    return res.status(201).json({ success: true, data: user, message: "User created" });
  } catch (error) {
    return next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const user = await updateUser({
      targetId: req.params.id,
      payload: req.body,
      actor: req.user
    });

    return res.json({ success: true, data: user, message: "User updated" });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await deactivateUser({
      targetId: req.params.id,
      actorId: req.user.id
    });

    return res.json({ success: true, data: user, message: "User deactivated" });
  } catch (error) {
    return next(error);
  }
};

export { getMe, putMe, getAllUsers, getOneUser, postUser, putUser, deleteUser };
