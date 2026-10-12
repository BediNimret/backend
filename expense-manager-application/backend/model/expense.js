const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Food",
      "Travel",
      "Shopping",
      "Entertainment",
      "Health",
      "Education",
      "Bills",
      "Miscellaneous",
    ],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const expenseModel = mongoose.model("expense_sheet", expenseSchema);

module.exports = expenseModel;
