const express = require('express');

const router = express.Router();
const isAuth = require('../utils/isAuth');

const loginController = require('../controllers/login');

// /login/
router.post('/', loginController.login);
router.get('/logintoken', isAuth);

module.exports = router;
