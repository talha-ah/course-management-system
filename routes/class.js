const express = require('express');

const router = express.Router();

const ClassController = require('../controllers/class');

router.post('/addclass', ClassController.makeClass);

router.get('/getclass/:classId', ClassController.getClass);

router.post('/addstudent', ClassController.addStudent);

module.exports = router;
