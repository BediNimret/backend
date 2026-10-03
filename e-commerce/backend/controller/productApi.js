const productModel = require("../model/product");

async function getProducts(req, res) {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
}

async function createProduct(req, res) {
  const { title, description, price, url } = req.body;
  try {
    const product = await productModel.create({
      title,
      description,
      price,
      url,
    });
    res.status(201).json(product);
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: "Error creating product" });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    res
      .status(status)
      .json({ message: error.message || "Error deleting product" });
  }
}

async function editProduct(req, res) {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    const status =
      error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500;
    res.status(status).json({ message: "Error updating product" });
  }
}

module.exports = { getProducts, createProduct, deleteProduct, editProduct };
