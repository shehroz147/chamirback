// Express Router
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require('../controllers/userController');


// Routes
router.post('/createAdmin', UserController.createAdmin);
router.post("/showAllUsers", UserController.showAllUsers);
router.post("/login", UserController.login);
router.post("/deleteUser", UserController.deleteUser);
module.exports = router;
