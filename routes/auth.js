const express = require("express");
const router = express.Router();
const { registerUser, registerClient } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/register-client", registerClient);

module.exports = router;