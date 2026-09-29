const express = require("express");
const router = express.Router();
const {
  getTodos,
  createTodos,
  deleteTodos,
  updateTodos,
} = require("../controller/todoApi");

router.route("/").get(getTodos).post(createTodos);

router.route("/:id").delete(deleteTodos).put(updateTodos);

module.exports = router;
