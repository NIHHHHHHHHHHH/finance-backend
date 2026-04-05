const Transaction = require("../models/Transaction");


const getSummary = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      { $match: {} },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = result.find((r) => r._id === "income");
    const expense = result.find((r) => r._id === "expense");

    const totalIncome = income?.total || 0;
    const totalExpenses = expense?.total || 0;
    const netBalance = totalIncome - totalExpenses;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        incomeCount: income?.count || 0,
        expenseCount: expense?.count || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getCategoryTotals = async (req, res, next) => {
  try {
    const { type } = req.query; // optional filter: income | expense
    const matchStage = {  };
    if (type) matchStage.type = type;

    const categoryTotals = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, categoryTotals });
  } catch (error) {
    next(error);
  }
};


const getMonthlyTrends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const matchStage = { };

    if (year) {
      matchStage.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    const trends = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          type: "$_id.type",
          total: 1,
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.json({ success: true, trends });
  } catch (error) {
    next(error);
  }
};


const getRecentActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recent = await Transaction.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, recent });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity };