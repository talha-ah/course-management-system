const express = require('express');

const router = express.Router();

const teacherController = require('../controllers/teacher');

// /teacher

// Profile
router.post('/editprofile', teacherController.editProfile);
router.post('/editcv', teacherController.editCV);

// Courses
router.post('/takecourse', teacherController.takeCourse);
router.delete('/removecourse', teacherController.removeCourse);

// NCEAC Forms
router.post('/addcourselog', teacherController.addCourseLog);
router.post('/addcoursedescription', teacherController.addCourseDescription);
router.post('/addcoursemonitoring', teacherController.addCourseMonitoring);

// Materials
router.post('/addassignment', teacherController.addAssignment);
router.post('/addquiz', teacherController.addQuiz);
router.post('/addpaper', teacherController.addPaper);

module.exports = router;
