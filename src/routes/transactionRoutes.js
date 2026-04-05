const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect, authorize } = require("../middleware/auth");
const { transactionValidation, updateTransactionValidation } = require("../utils/validators");

// All routes require authentication
router.use(protect);

// Read access: all roles
router.get("/", getTransactions);
router.get("/:id", getTransactionById);

// Write access: admin only
router.post("/", authorize("admin"), transactionValidation, createTransaction);
router.put("/:id", authorize("admin"), updateTransactionValidation, updateTransaction);
router.delete("/:id", authorize("admin"), deleteTransaction);

module.exports = router;