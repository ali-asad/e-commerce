const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const service = require("../services/orderService");

router.post("/orders", authenticate, service.placeOrder);
router.get("/orders/:id", authenticate, service.getOrder);

module.exports = router;
