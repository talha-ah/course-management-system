const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const Teacher = require('../models/teacher');
const adminController = require('../controllers/admin');

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

router.post(
  '/createteacher',
  [body('email').isEmail(), body('code')],
  adminController.createTeacher
);

router.get('/deactiveteacher/:teacherid', adminController.deactivateTeacher);

module.exports = router;
