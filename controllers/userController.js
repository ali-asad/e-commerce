const express = require("express");
const router = express.Router();
const service = require("../services/userService");

router.post("/register", service.register);
router.post("/login", service.login);
router.get("/me", service.getUserInfo);

module.exports = router;
