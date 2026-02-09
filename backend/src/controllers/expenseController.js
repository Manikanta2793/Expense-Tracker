import { Expense } from "../models/expenseModel.js";

const createExpense = async (req, res) => {
    try {
        const { description, amount, category, date, notes } = req.body;
        const ownerId = req.user?.id;

        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const expense = new Expense({ description, amount, category, date, notes, user: ownerId });
        const newExpense = await expense.save();
        res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllExpense = async (req, res) => {
    try {
        const ownerId = req.user?.id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const expense = await Expense.find({ user: ownerId }).sort({ date: -1 });
        res.json({ success: true, count: expense.length, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user?.id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { description, amount, category, date, notes } = req.body;
        const updates = { description, amount, category, date, notes };
        Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

        const updateExpense = await Expense.findOneAndUpdate(
            { _id: id, user: ownerId },
            updates,
            { new: true, runValidators: true }
        );

        if (!updateExpense) {
            return res.status(404).json({ success: false, message: "Not Found" });
        }
        res.json({ success: true, data: updateExpense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user?.id;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const deleteExpense = await Expense.findOneAndDelete({ _id: id, user: ownerId });
        if (!deleteExpense) {
            return res.status(404).json({ success: false, message: "Not Found" });
        }
        res.json({ success: true, msg: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createExpense, getAllExpense, updateExpense, deleteExpense };




