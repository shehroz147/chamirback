// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require('../controllers/userController');


// Routes
router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.post('/userData', UserController.getUserData);


module.exports = router;
