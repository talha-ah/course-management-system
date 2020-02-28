const express = require('express');
const multer = require('multer');

const router = express.Router();

const teacherController = require('../controllers/teacher');

// =========================================================== Multer ================================================

// Multer Storage
const fileStorageCV = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'data/cv');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

// Multer FileFilter
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// File Upload Handler
const uploadCV = multer({ storage: fileStorageCV });

// multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
// multer({ storage: fileStorage }).array('image', 2)

// ======================================================== Multer Ends ================================================

// /teacher

// Profile
router.get('/getteacher/:teacherId', teacherController.getTeacher);
router.post('/getteacher/:teacherId', teacherController.editProfile);
router.post(
  '/editcv/:teacherId',
  uploadCV.single('image'),
  teacherController.editCV
);

// Courses
router.get('/listcourses', teacherController.getCourses);
router.get('/courses/:teacherId', teacherController.getTeacherCourses);
router.post('/takecourse/:teacherId', teacherController.takeCourse);
router.delete('/removecourse/:teacherId', teacherController.removeCourse);

// NCEAC Forms
router.post('/addcourselog/:teacherId', teacherController.addCourseLog);
router.post(
  '/addcoursedescription/:teacherId',
  teacherController.addCourseDescription
);
router.post(
  '/addcoursemonitoring/:teacherId',
  teacherController.addCourseMonitoring
);

// Materials
router.post('/addassignment/:teacherId', teacherController.addAssignment);
router.post('/addquiz/:teacherId', teacherController.addQuiz);
router.post('/addpaper/:teacherId', teacherController.addPaper);

module.exports = router;
