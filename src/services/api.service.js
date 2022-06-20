const productModel = require("../models/Product");

const createProduct = (req, res, next) => {
  const createProduct = productModel.create(req.body);
  res.status(201).json(createProduct);
};

module.exports = {
  createProduct,
};
