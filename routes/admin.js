const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

// /admin
router.get('/getadmin/:adminId', adminController.getAdmin);
router.post('/editadmin/:adminId', adminController.editAdmin);
router.post('/signup', adminController.adminSignup);

// teachers
router.post('/createteacher', adminController.createTeacher);
router.get('/deactiveteacher/:teacherid', adminController.deactivateTeacher);
router.get('/reactivateteacher/:teacherid', adminController.reactivateTeacher);

// courses
router.post('/createcourse', adminController.createCourse);
router.put('/editcourse', adminController.updateCourse);
router.delete('/deletecourse/:courseId', adminController.deleteCourse);

module.exports = router;
