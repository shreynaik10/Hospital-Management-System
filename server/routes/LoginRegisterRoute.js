const express = require("express");
const router = express.Router();

const {
    signUp,
    verifyUser
} = require('../controllers/RegisterController.js')

const {
    loginUser
} = require('../controllers/LoginController.js')



router.post('/signup', signUp);
router.get('/verify/:id', verifyUser);
router.post('/login', loginUser);

module.exports = router