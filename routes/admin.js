const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../utils/isAuth');

// /admin
router.get('/getadmin', isAuth, adminController.getAdmin);
router.post('/editadmin', isAuth, adminController.editAdmin);
router.post('/editadminpassword', isAuth, adminController.editAdminPassword);

// teachers
router.get('/teachers', isAuth, adminController.getTeachers);
router.get('/teacher/:teacherId', isAuth, adminController.getTeacher);
router.post('/createteacher', isAuth, adminController.createTeacher);
router.get(
  '/deactiveteacher/:teacherId',
  isAuth,
  adminController.deactivateTeacher
);
router.post('/reactivateteacher', isAuth, adminController.reactivateTeacher);

// courses
router.get('/courses', isAuth, adminController.getCourses);
router.get('/course/:courseId', isAuth, adminController.getCourse);
router.post('/createcourse', isAuth, adminController.createCourse);
router.post('/editcourse', isAuth, adminController.updateCourse);
router.get(
  '/deactivatecourse/:courseId',
  isAuth,
  adminController.deactivateCourse
);
router.delete('/deletecourse', isAuth, adminController.deleteCourse);

module.exports = router;
