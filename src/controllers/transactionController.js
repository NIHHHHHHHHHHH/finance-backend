const { validationResult } = require("express-validator");
const Transaction = require("../models/Transaction");


const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = { $regex: category, $options: "i" };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      transactions,
    });
  } catch (error) {
    next(error);
  }
};


const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("createdBy", "name email");
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }
    res.json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};


const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, type, category, date, notes } = req.body;

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Transaction created successfully.", transaction });
  } catch (error) {
    next(error);
  }
};


const updateTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, type, category, date, notes } = req.body;
    const updateData = {};
    if (amount !== undefined) updateData.amount = amount;
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (date) updateData.date = date;
    if (notes !== undefined) updateData.notes = notes;
    
    
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    }).populate("createdBy", "name email");

    if (!transaction) {
      return res.status(404).json({success: false, message: "Transaction not found."});
    }

    res.json({success: true, message: "Transaction updated successfully.", transaction});
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const result = await Transaction.updateOne(
      { _id: req.params.id },
      { isDeleted: true, deletedAt: new Date() }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found." });
    }

    res.json({ success: true, message: "Transaction deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};