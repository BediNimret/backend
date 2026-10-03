const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: [100, "Cannot exceed 100 characters"],
    },
    description: String,
    price: Number,
    url: String,
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
