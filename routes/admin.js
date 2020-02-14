const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const Teacher = require('../models/teacher');
const adminController = require('../controllers/admin');

// /admin/
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid Email!')
      .custom((value, { req }) => {
        return Teacher.findOne({ email: value }).then(teacherDoc => {
          if (teacherDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 }),
    body('firstname')
      .trim()
      .not()
      .isEmpty(),
    body('lastname')
      .trim()
      .not()
      .isEmpty()
  ],

  adminController.adminSignup
);

// /admin/
router.post(
  '/createteacher',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid Email!')
      .custom(async (value, { req }) => {
        const teacherDoc = await Teacher.findOne({ email: value });
        if (teacherDoc) {
          return Promise.reject('E-Mail address already exists!');
        }
      })
      .normalizeEmail(),
    body('code')
      .trim()
      .not()
      .isEmpty()
  ],
  adminController.createTeacher
);

// /admin/
router.get('/deactiveteacher/:teacherid', adminController.deactivateTeacher);

// /admin/
router.post(
  '/createcourse',
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('code')
      .trim()
      .not()
      .isEmpty()
  ],
  adminController.createCourse
);

// /admin/
router.put(
  '/editcourse',
  [
    body('title')
      .trim()
      .not()
      .isEmpty(),
    body('code')
      .trim()
      .not()
      .isEmpty()
  ],
  adminController.updateCourse
);

// /admin/
router.delete('/deletecourse/:courseId', adminController.deleteCourse);

module.exports = router;
