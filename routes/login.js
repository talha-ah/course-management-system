const express = require('express');

const router = express.Router();

const loginController = require('../controllers/login');

// /login/
router.post('/', loginController.login);
router.post('signup', loginController.signUp);
router.post('/forgetpassword', loginController.forgetPassword);

module.exports = router;
