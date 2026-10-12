const expenseManager = require("../model/expense");
async function getExpense(req, res) {
  try {
    const { dateFilter } = req.query;
    const now = new Date();
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    let startDate;
    let endDate;

    switch (dateFilter) {
      case undefined:
      case "all":
        break;
      case "today":
        startDate = todayStart;
        endDate = new Date(todayStart);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        break;
      case "last7Days":
        startDate = new Date(todayStart);
        startDate.setUTCDate(startDate.getUTCDate() - 6);
        endDate = new Date(todayStart);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        break;
      case "thisMonth":
        startDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
        );
        endDate = new Date(todayStart);
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        break;
      case "lastMonth":
        startDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
        );
        endDate = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid date filter" });
    }

    const query = { createdBy: req.user.id };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lt: endDate };
    }
    const expenses = await expenseManager.find(query);
    res.status(200).json({ message: "Successful", data: expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR" });
  }
}
async function addExpense(req, res) {
  const { id, title, amount, description, category, date } = req.body;
  try {
    const expense = await expenseManager.create({
      id,
      createdBy: req.user.id,
      title,
      amount,
      description,
      category,
      date,
    });
    if (!expense) {
      return res.status(400).json({ message: "Expense not created" });
    }
    res.status(201).json({ message: "Successful", data: expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
}
async function updateExpense(req, res) {
  try {
    const expense = await expenseManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Successful", data: expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR" });
  }
}
async function deleteExpense(req, res) {
  try {
    const expense = await expenseManager.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Successful", data: expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR" });
  }
}
module.exports = { getExpense, addExpense, updateExpense, deleteExpense };
