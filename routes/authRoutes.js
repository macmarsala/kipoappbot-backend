const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signin", authController.signin);
router.post("/telegram/login", authController.telegramLogin);
router.post("/telegram/logout", authMiddleware, authController.telegramLogout);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
