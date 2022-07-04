// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const ProductController = require('../controllers/productController');


// Routes
router.post("/getProducts", ProductController.viewProducts);
router.post("/addProduct", ProductController.createProduct);
module.exports = router;
