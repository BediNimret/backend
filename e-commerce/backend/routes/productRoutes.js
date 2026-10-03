const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const {
  getProducts,
  createProduct,
  deleteProduct,
  editProduct,
} = require("../controller/productApi");

router.route("/").get(getProducts).post(checkAuth, createProduct);
router
  .route("/:id")
  .delete(checkAuth, deleteProduct)
  .put(checkAuth, editProduct);

module.exports = router;
