const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get All Expenses
exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Expenses as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: "No expense data available" });
        }

        // Prepare data for Excel
        const data = expenses.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toDateString(),
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");

        const filePath = "expense_details.xlsx";
        xlsx.writeFile(wb, filePath);
        res.download(filePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
