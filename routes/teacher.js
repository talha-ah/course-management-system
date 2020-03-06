const express = require('express');
const multer = require('multer');

const router = express.Router();

const isAuth = require('../utils/isAuth');
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

// multer({ storage: fileStorage, fileFilter: fileFilter }).array('image', 2)

// ======================================================== Multer Ends ================================================

// /teacher

// Profile
router.get('/getteacher', isAuth, teacherController.getTeacher);
router.post('/editteacher', isAuth, teacherController.editProfile);
router.post(
  '/editteacherpassword',
  isAuth,
  teacherController.editProfilePassword
);
router.post(
  '/editcv',
  isAuth,
  uploadCV.single('image'),
  teacherController.editCV
);

// Courses
router.get('/courses', isAuth, teacherController.getTeacherCourses);
router.get('/listcourses', isAuth, teacherController.getCourses);
router.post('/takecourse', isAuth, teacherController.takeCourse);
router.delete('/removecourse', isAuth, teacherController.removeCourse);

// NCEAC Forms
router.post('/addcourselog', isAuth, teacherController.addCourseLog);
router.post(
  '/addcoursedescription',
  isAuth,
  teacherController.addCourseDescription
);
router.post(
  '/addcoursemonitoring',
  isAuth,
  teacherController.addCourseMonitoring
);

// Materials
router.post('/addassignment', isAuth, teacherController.addAssignment);
router.post('/addquiz', isAuth, teacherController.addQuiz);
router.post('/addpaper', isAuth, teacherController.addPaper);

module.exports = router;
