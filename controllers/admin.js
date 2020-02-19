const bcrypt = require('bcryptjs');

const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Course = require('../models/course');

exports.adminSignup = async (req, res, next) => {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = new Admin({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword
  });
  admin
    .save()
    .then(admin => {
      if (!admin) {
        const err = new Error('Admin creation failed!');
        err.code = 404;
        throw err;
      }
      res.send({ admin: admin });
    })
    .catch(err => {
      if (err.status) {
        err.status = 500;
      }
      console.log('AdminSignup', err);
    });
};

// ================================================= Teachers Section ================================================

exports.createTeacher = async (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const role = req.body.role;

  const password = 'DefaultPassword';
  const status = 'Active';
  const dpURL = 'undefined';
  const cvUrl = 'undefined';

  const hashedPassword = await bcrypt.hash(password, 12);

  const teacher = new Teacher({
    email: teacherEmail,
    code: teacherCode,
    password: hashedPassword,
    status: status,
    role: role,
    dpURL: dpURL,
    cvUrl: cvUrl
  });

  teacher
    .save()
    .then(teacher => {
      if (!teacher) {
        const err = new Error('Teacher creation failed!');
        err.code = 404;
        throw err;
      }
      res.send({ teacher: teacher });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.deactivateTeacher = (req, res, next) => {
  const teacherId = req.params.teacherid;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in finding the teacher!');
        error.code = 404;
        throw new error();
      }
      teacher.status = 'Inactive';
      return teacher.save();
    })
    .then(updatedTeacher => {
      if (!updatedTeacher) {
        const error = new Error('Error in saving the teacher!');
        error.code = 404;
        throw new error();
      }
      res.send({ teacher: updatedTeacher });
    })
    .catch(err => {
      if (err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.reactivateTeacher = (req, res, next) => {
  const teacherId = req.params.teacherid;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in finding the teacher!');
        error.code = 404;
        throw new error();
      }
      teacher.status = 'Active';
      return teacher.save();
    })
    .then(updatedTeacher => {
      if (!updatedTeacher) {
        const error = new Error('Error in saving the teacher!');
        error.code = 404;
        throw new error();
      }
      res.send({ teacher: updatedTeacher });
    })
    .catch(err => {
      if (err.status) {
        err.status = 500;
      }
      next(err);
    });
};

// ================================================= Courses Section ================================================

exports.createCourse = (req, res, next) => {
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const credits = req.body.credits;

  const course = new Course({
    title: courseTitle,
    code: courseCode,
    credits: credits
  });

  course
    .save()
    .then(courseData => {
      if (!courseData) {
        const err = new Error('Course creation failed!');
        err.code = 404;
        throw err;
      }
      res.send({ course: courseData });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.updateCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const credits = req.body.credits;

  Course.findById(courseId)
    .then(course => {
      if (!course) {
        const err = new Error('Course fetching failed!');
        err.code = 404;
        throw err;
      }
      course.title = courseTitle;
      course.code = courseCode;
      course.credits = credits;
      return course.save();
    })
    .then(courseData => {
      if (!courseData) {
        const error = new Error('Error in saving the course!');
        error.code = 404;
        throw new error();
      }
      res.send({ course: courseData });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

exports.deleteCourse = (req, res, next) => {
  const courseId = req.params.courseId;

  // Delete from all places

  Course.findByIdAndDelete(courseId)
    .then(course => {
      if (!course) {
        const error = new Error('Error in deleting the course!');
        error.code = 404;
        throw new error();
      }
      res.send({ course: course });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};
