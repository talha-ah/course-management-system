const express = require('express');

const router = express.Router();

const teacherController = require('../controllers/teacher');

// /teacher
// Courses
router.post('/takecourse', teacherController.takeCourse);
router.delete('/removecourse', teacherController.removeCourse);

// NCEAC Forms
router.post('/addcourselog', teacherController.addCourseLog);
router.post('/addcoursedesc', teacherController.addCourseDescription);
router.post('/addcoursemoni', teacherController.addCourseMonitoring);

// Materials
router.post('/addquiz', teacherController.addQuiz);
router.post('/addpaper', teacherController.addPaper);
router.post('/addassignment', teacherController.addAssignment);

module.exports = router;
