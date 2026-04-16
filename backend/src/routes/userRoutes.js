import { Router } from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import checkRole from "../middleware/checkRole.js";
import {
  createUserValidation,
  updateUserValidation,
  updateMeValidation,
  userQueryValidation,
  idParamValidation
} from "../middleware/validateInput.js";
import {
  getMe,
  putMe,
  getAllUsers,
  getOneUser,
  postUser,
  putUser,
  deleteUser
} from "../controllers/userController.js";

const router = Router();

router.use(verifyJWT);

router.get("/me", getMe);
router.put("/me", updateMeValidation, putMe);

router.get("/", checkRole(["Admin", "Manager"]), userQueryValidation, getAllUsers);
router.get("/:id", checkRole(["Admin", "Manager"]), idParamValidation, getOneUser);
router.post("/", checkRole(["Admin"]), createUserValidation, postUser);
router.put("/:id", checkRole(["Admin", "Manager"]), idParamValidation, updateUserValidation, putUser);
router.delete("/:id", checkRole(["Admin"]), idParamValidation, deleteUser);

export default router;
