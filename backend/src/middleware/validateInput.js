import { checkSchema, validationResult } from "express-validator";

const applyValidation = (schema) => checkSchema(schema);

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  return next();
};

const commonString = {
  trim: true,
  escape: true
};

const authLoginValidation = [
  ...applyValidation({
    identifier: {
      in: ["body"],
      notEmpty: { errorMessage: "identifier is required" },
      ...commonString
    },
    password: {
      in: ["body"],
      notEmpty: { errorMessage: "password is required" },
      isLength: { options: { min: 6 }, errorMessage: "password must be at least 6 characters" },
      ...commonString
    }
  }),
  validateRequest
];

const authRegisterValidation = [
  ...applyValidation({
    name: {
      in: ["body"],
      notEmpty: { errorMessage: "name is required" },
      ...commonString
    },
    email: {
      in: ["body"],
      isEmail: { errorMessage: "valid email is required" },
      normalizeEmail: true
    },
    password: {
      in: ["body"],
      isLength: { options: { min: 6 }, errorMessage: "password must be at least 6 characters" },
      ...commonString
    },
    role: {
      in: ["body"],
      optional: true,
      isIn: { options: [["Admin", "Manager", "User"]], errorMessage: "invalid role" }
    }
  }),
  validateRequest
];

const createUserValidation = [
  ...applyValidation({
    name: {
      in: ["body"],
      notEmpty: { errorMessage: "name is required" },
      ...commonString
    },
    email: {
      in: ["body"],
      isEmail: { errorMessage: "valid email is required" },
      normalizeEmail: true
    },
    password: {
      in: ["body"],
      optional: { options: { values: "falsy" } },
      isLength: { options: { min: 6 }, errorMessage: "password must be at least 6 characters" },
      ...commonString
    },
    role: {
      in: ["body"],
      optional: true,
      isIn: { options: [["Admin", "Manager", "User"]], errorMessage: "invalid role" }
    },
    status: {
      in: ["body"],
      optional: true,
      isIn: { options: [["active", "inactive"]], errorMessage: "invalid status" }
    }
  }),
  validateRequest
];

const updateUserValidation = [
  ...applyValidation({
    name: {
      in: ["body"],
      optional: true,
      ...commonString
    },
    email: {
      in: ["body"],
      optional: true,
      isEmail: { errorMessage: "valid email is required" },
      normalizeEmail: true
    },
    password: {
      in: ["body"],
      optional: { options: { values: "falsy" } },
      isLength: { options: { min: 6 }, errorMessage: "password must be at least 6 characters" },
      ...commonString
    },
    role: {
      in: ["body"],
      optional: true,
      isIn: { options: [["Admin", "Manager", "User"]], errorMessage: "invalid role" }
    },
    status: {
      in: ["body"],
      optional: true,
      isIn: { options: [["active", "inactive"]], errorMessage: "invalid status" }
    }
  }),
  validateRequest
];

const updateMeValidation = [
  ...applyValidation({
    name: {
      in: ["body"],
      optional: true,
      ...commonString
    },
    password: {
      in: ["body"],
      optional: { options: { values: "falsy" } },
      isLength: { options: { min: 6 }, errorMessage: "password must be at least 6 characters" },
      ...commonString
    }
  }),
  validateRequest
];

const userQueryValidation = [
  ...applyValidation({
    page: {
      in: ["query"],
      optional: true,
      isInt: { options: { min: 1 }, errorMessage: "page must be >= 1" },
      toInt: true
    },
    limit: {
      in: ["query"],
      optional: true,
      isInt: { options: { min: 1, max: 100 }, errorMessage: "limit must be between 1 and 100" },
      toInt: true
    },
    role: {
      in: ["query"],
      optional: { options: { values: "falsy" } },
      isIn: { options: [["Admin", "Manager", "User"]], errorMessage: "invalid role" }
    },
    status: {
      in: ["query"],
      optional: { options: { values: "falsy" } },
      isIn: { options: [["active", "inactive"]], errorMessage: "invalid status" }
    }
  }),
  validateRequest
];

const idParamValidation = [
  ...applyValidation({
    id: {
      in: ["params"],
      isMongoId: { errorMessage: "id must be a valid MongoDB ObjectId" }
    }
  }),
  validateRequest
];

export {
  authLoginValidation,
  authRegisterValidation,
  createUserValidation,
  updateUserValidation,
  updateMeValidation,
  userQueryValidation,
  idParamValidation
};
