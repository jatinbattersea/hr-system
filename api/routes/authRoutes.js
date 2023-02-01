const express = require("express");
const {
    loginUser,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/accounts/login", loginUser);

module.exports = router;