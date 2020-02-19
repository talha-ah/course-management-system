const express = require('express');

const router = express.Router();

const Teacher = require('../models/teacher');
const adminController = require('../controllers/admin');

// /admin
router.post('/signup', adminController.adminSignup);

router.post('/createteacher', adminController.createTeacher);

router.get('/deactiveteacher/:teacherid', adminController.deactivateTeacher);

router.get('/reactivateteacher/:teacherid', adminController.reactivateTeacher);

router.post('/createcourse', adminController.createCourse);

router.put('/editcourse', adminController.updateCourse);

router.delete('/deletecourse/:courseId', adminController.deleteCourse);

module.exports = router;
