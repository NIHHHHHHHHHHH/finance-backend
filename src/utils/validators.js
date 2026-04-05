const { body, param } = require("express-validator");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Please provide a valid email.").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  body("role")
    .optional()
    .isIn(["viewer", "analyst", "admin"])
    .withMessage("Role must be viewer, analyst, or admin."),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const transactionValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number greater than 0."),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date."),
  body("notes").optional().trim(),
];

const updateTransactionValidation = [
  body("amount").optional().isFloat({ min: 0.01 }).withMessage("Amount must be a positive number greater than 0."),
  body("type").optional().isIn(["income", "expense"]).withMessage("Type must be income or expense."),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty."),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date."),
  body("notes").optional().trim(),
];


module.exports = {
  registerValidation,
  loginValidation,
  transactionValidation,
  updateTransactionValidation,
};