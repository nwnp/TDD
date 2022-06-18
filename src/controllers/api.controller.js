const express = require("express");
const router = express.Router();
const productService = require("../services/api.service");

router.get("/product", productService.products);

module.exports = router;
