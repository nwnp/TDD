const express = require("express");
const router = express.Router();
const productService = require("../services/api.service");

router.post("/product", productService.createProduct);

module.exports = router;
