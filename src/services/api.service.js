const productModel = require("../models/Product");

const createProduct = async (req, res, next) => {
  try {
    const createProduct = await productModel.create(req.body);
    res.status(201).json(createProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
};
