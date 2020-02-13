const { validationResult } = require('express-validator');

const Teacher = require('../models/teacher');
const { clearFile } = require('../util/clearFile');

exports.getProfile = (req, res, next) => {
  const teacherId = req.params.profileId;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const err = new Error('Teacher not found!');
        err.status = 404;
        throw err;
      }
      res.status(200).json({ message: 'Teacher fetched.', teacher: teacher });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.editProfile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation Invalid');
    err.status = 422;
    throw err;
  }
  const teacherId = req.params.profileId;
  const name = req.body.name;
  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const err = new Error('Could not find teacher.');
        err.status = 422;
        throw err;
      }
      teacher.name = name;
      if (req.file) {
        var imagePath = req.file.path;
        imagePath = imagePath.replace(/\\/g, '/');
        if (imagePath !== teacher.imageUrl) {
          clearFile(teacher.imageUrl);
          teacher.imageUrl = imagePath;
        }
      }
      return teacher.save();
    })
    .then(updatedTeacher => {
      res
        .status(200)
        .json({ message: 'Profile Updated.', teacher: updatedTeacher });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.editProfileCV = (req, res, next) => {
  const teacherId = req.params.profileId;
  if (!req.file) {
    const err = new Error('No file provided.');
    err.status = 422;
    throw err;
  }
  var cvPath = req.file.path;
  if (!cvPath) {
    const err = new Error('File not provided.');
    err.status = 422;
    throw err;
  }
  cvPath = cvPath.replace(/\\/g, '/');

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const err = new Error('Could not find teacher.');
        err.status = 422;
        throw err;
      }

      if (cvPath === teacher.cvUrl) {
        const err = new Error('File already exists.');
        err.status = 422;
        throw err;
      }

      teacher.cvUrl = cvPath;
      return teacher.save();
    })
    .then(updatedTeacher => {
      res
        .status(200)
        .json({ message: 'CV Uploaded.', cvUrl: updatedTeacher.cvUrl });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};
