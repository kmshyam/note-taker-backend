const express = require("express");
const UserController = require("../controllers/user-auth");
const router = express.Router();

router.post("/signup", UserController.postSignUp);

router.post("/signin", UserController.postSignIn);

module.exports = router;
