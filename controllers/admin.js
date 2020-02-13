const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Course = require('../models/course');

exports.adminSignup = (req, res, next) => {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const password = req.body.password;

  // crypt password

  const admin = new Admin({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
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
      console.log('[AdminSignup.Admin]', err);
    });
};

// ================================================= Teachers Section ================================================

exports.createTeacher = (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;

  const password = 'DefaultPassword';
  const status = 'Active';

  // cryptPassword

  const teacher = new Teacher({
    email: teacherEmail,
    code: teacherCode,
    password: password,
    status: status
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
      console.log('[CreateTeacher.Admin]', err);
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
    .then(saveResult => {
      if (!saveResult) {
        const error = new Error('Error in saving the teacher!');
        error.code = 404;
        throw new error();
      }
      res.send({ teacher: teacher });
    })
    .catch(err => {
      console.log('[DeactivateTeacher.Admin]', err);
    });
};

// ================================================= Courses Section ================================================

exports.createCourse = (req, res, next) => {
  const courseTitle = req.body.title;
  const courseCode = req.body.code;

  const course = new Course({
    title: courseTitle,
    code: courseCode
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
      console.log('[CreateCourse.Admin]', err);
    });
};

exports.updateCourse = (req, res, next) => {
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const courseId = req.body.courseId;

  Course.findById(courseId)
    .then(course => {
      if (!course) {
        const err = new Error('Course fetching failed!');
        err.code = 404;
        throw err;
      }
      course.title = courseTitle;
      course.code = courseCode;
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
      console.log('[UpdateCourse.Admin]', err);
    });
};

exports.deleteCourse = (req, res, next) => {
  const courseId = req.params.courseId;

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
      console.log('[deleteCourse.Admin]', err);
    });
};
