const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { updateUserValidation } = require("../utils/validators");

// All user management routes are admin only
router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserValidation, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;