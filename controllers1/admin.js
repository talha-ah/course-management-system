const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Teacher = require('../models/teacher');

exports.createTeacher = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const imageUrl = 'undefined';
  const cvUrl = 'undefined';
  const status = 'idle';

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const teacher = new Teacher({
        name: name,
        email: email,
        password: hashedPassword,
        imageUrl: imageUrl,
        cvUrl: cvUrl,
        status: status
      });

      return teacher.save();
    })
    .then(createdTeacher => {
      res.status(201).json({
        message: 'Teacher Created.',
        teacherName: createdTeacher.name
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};
