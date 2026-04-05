const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

// All dashboard routes require auth; viewer, analyst, and admin can all access
router.use(protect, authorize("viewer", "analyst", "admin"));

router.get("/summary", getSummary);
router.get("/category-totals", getCategoryTotals);
router.get("/monthly-trends", getMonthlyTrends);
router.get("/recent-activity", getRecentActivity);

module.exports = router;