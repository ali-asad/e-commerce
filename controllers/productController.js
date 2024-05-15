const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const service = require("../services/productService");

router.post("/create", service.createProduct);
router.get("/list", service.getProducts);
router.put("/:id", authenticate, service.updateProduct);
router.delete("/:id", authenticate, service.deleteProduct);

module.exports = router;
