const express = require('express');
const multer = require('multer');

const router = express.Router();

const isAuth = require('../utils/isAuth');
const teacherController = require('../controllers/teacher');

// =========================================================== Multer ================================================

// ============================== CV ========
// Multer Storage
const fileStorageCV = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/cv');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

// Multer FileFilter
const fileFilterCV = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// File Upload Handler
const uploadCV = multer({ storage: fileStorageCV, fileFilter: fileFilterCV });
// ============================== CV ==========

// ============================== Assignment ========
// Multer Storage
const fileStorageAssignment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/assignments');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

// Multer FileFilter
const fileFilterAssignment = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// File Upload Handler
const uploadAssignment = multer({
  storage: fileStorageAssignment,
  fileFilter: fileFilterAssignment,
});

// ============================== Assignment ==========
// ============================== Quiz ========
// Multer Storage
const fileStorageQuiz = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/quizzes');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

// Multer FileFilter
const fileFilterQuiz = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// File Upload Handler
const uploadQuiz = multer({
  storage: fileStorageQuiz,
  fileFilter: fileFilterQuiz,
});

// ============================== Quiz ==========
// ============================== Paper ========
// Multer Storage
const fileStoragePaper = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/papers');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

// Multer FileFilter
const fileFilterPaper = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// File Upload Handler
const uploadPaper = multer({
  storage: fileStoragePaper,
  fileFilter: fileFilterPaper,
});

// ============================== Paper ==========

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
router.get('/course/:courseId', isAuth, teacherController.getCourse);
router.get('/courses', isAuth, teacherController.getTeacherCourses);
router.get('/listcourses', isAuth, teacherController.getCourses);
router.post('/takecourse', isAuth, teacherController.takeCourse);
router.post('/editcourse', isAuth, teacherController.editCourse);
router.get('/disablecourse/:courseId', isAuth, teacherController.disableCourse);
router.get('/removecourse/:courseId', isAuth, teacherController.removeCourse);

// NCEAC Forms
router.get('/getcourselog/:courseId', isAuth, teacherController.getCourseLog);
router.post('/addcourselog/:logId', isAuth, teacherController.addCourseLog);

router.get(
  '/getdescription/:courseId',
  isAuth,
  teacherController.getCourseDescription
);
router.post(
  '/adddescription/:descriptionId',
  isAuth,
  teacherController.addCourseDescription
);

router.get(
  '/getmonitoring/:courseId',
  isAuth,
  teacherController.getCourseMonitoring
);
router.post(
  '/addmonitoring/:monitorId',
  isAuth,
  teacherController.addCourseMonitoring
);

// Materials
router.get(
  '/getassignments/:courseId',
  isAuth,
  teacherController.getAssignments
);
router.get(
  '/getassignment/:assignmentDocId/:assignmentId',
  isAuth,
  teacherController.getAssignment
);
router.post(
  '/addassignment/:assignmentId',
  isAuth,
  uploadAssignment.fields([
    { name: 'assignment', maxCount: 1 },
    { name: 'solution', maxCount: 1 },
  ]),
  teacherController.addAssignment
);
router.get(
  '/getassignmentresult/:assignmentDocId/:assignmentId',
  isAuth,
  teacherController.getAssignmentResult
);
router.post(
  '/addassignmentresult/:assignmentDocId/:assignmentId',
  isAuth,
  teacherController.addAssignmentResult
);

router.get('/getquizzes/:courseId', isAuth, teacherController.getQuizzes);
router.get('/getquiz/:quizDocId/:quizId', isAuth, teacherController.getQuiz);
router.post(
  '/addquiz/:quizId',
  isAuth,
  uploadQuiz.fields([
    { name: 'quiz', maxCount: 1 },
    { name: 'solution', maxCount: 1 },
  ]),
  teacherController.addQuiz
);
router.get(
  '/getquizresult/:quizDocId/:quizId',
  isAuth,
  teacherController.getQuizResult
);
router.post(
  '/addquizresult/:quizDocId/:quizId',
  isAuth,
  teacherController.addQuizResult
);

router.get('/getpapers/:courseId', isAuth, teacherController.getPapers);
router.get(
  '/getpaper/:paperDocId/:paperId',
  isAuth,
  teacherController.getPaper
);
router.post(
  '/addpaper/:paperId',
  isAuth,
  uploadQuiz.fields([
    { name: 'paper', maxCount: 1 },
    { name: 'solution', maxCount: 1 },
  ]),
  teacherController.addPaper
);
router.get(
  '/getpaperresult/:paperDocId/:paperId',
  isAuth,
  teacherController.getPaperResult
);
router.post(
  '/addpaperresult/:paperDocId/:paperId',
  isAuth,
  teacherController.addPaperResult
);

router.post(
  '/addassignmentgrades/:assignmentDocId',
  isAuth,
  teacherController.addAssignmentGrades
);
router.post(
  '/addquizgrades/:quizDocId',
  isAuth,
  teacherController.addQuizGrades
);
router.get(
  '/generatereport/:teacherCourseId/:batch/:semester/:section',
  isAuth,
  teacherController.generateReport
);

module.exports = router;
