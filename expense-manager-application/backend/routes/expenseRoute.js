const express = require("express");
const routes = express.Router();
const {
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
} = require("../control/expenseManager");
routes.route("/").get(getExpense).post(addExpense);
routes.route("/:id").put(updateExpense).delete(deleteExpense);

module.exports = routes;
