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
router.post('/updateteacher/:teacherId', isAuth, adminController.updateTeacher);
router.get(
  '/deactiveteacher/:teacherId',
  isAuth,
  adminController.deactivateTeacher
);
router.get('/enableteacher/:teacherId', isAuth, adminController.enableTeacher);
router.get(
  '/resetteacherpassword/:teacherId',
  isAuth,
  adminController.resetTeacherPassword
);

// courses
router.get('/courses', isAuth, adminController.getCourses);
router.get('/course/:courseId', isAuth, adminController.getCourse);
router.post('/editcourse/:courseId', isAuth, adminController.updateCourse);
router.post('/createcourse', isAuth, adminController.createCourse);
router.get(
  '/deactivatecourse/:courseId',
  isAuth,
  adminController.deactivateCourse
);
router.delete('/deletecourse', isAuth, adminController.deleteCourse);

router.get(
  '/generatereport/:teacherId/:teacherCourseId/:batch/:semester/:section',
  isAuth,
  adminController.generateReport
);

module.exports = router;
