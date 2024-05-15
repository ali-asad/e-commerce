const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const service = require("../services/cartService");

router.post("/add", authenticate, service.addToCart);
router.post("/remove", authenticate, service.removeFromCart);
router.get("/list", authenticate, service.getCart);

module.exports = router;
