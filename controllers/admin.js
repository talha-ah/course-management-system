const bcrypt = require('bcryptjs');

const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Course = require('../models/course');

exports.getAdmin = async (req, res, next) => {
  const adminId = req.userId;
  const isAdmin = req.isAdmin;

  try {
    if (!isAdmin) {
      var error = new Error('Not Authorized!');
      error.status = 400;
      throw error;
    }

    const admin = await Admin.findById(adminId).select('-password');

    if (!admin) {
      var error = new Error('User not found!');
      error.status = 400;
      throw error;
    }

    res.status(200).json({ message: 'User Fetched!', user: admin });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editAdmin = async (req, res, next) => {
  const adminId = req.params.adminId;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      const error = new Error('User could not be found!');
      error.status = 400;
      throw error;
    }

    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;
    const updateAdmin = await admin.save();

    if (!updateAdmin) {
      const error = new Error('User could not be saved!');
      error.status = 400;
      throw error;
    }

    res.status(201).json({ message: 'User saved!', user: updatedAdmin });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

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
        const err = new Error('User creation failed!');
        err.code = 404;
        throw err;
      }
      res.send({ user: admin });
    })
    .catch(err => {
      if (err.status) {
        err.status = 500;
      }
      next(err);
    });
};

// ================================================= Teachers Section ================================================

exports.createTeacher = async (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const role = req.body.role;

  const password = 'DefaultPassword';
  const status = 'Pending';
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
        const err = new Error('User creation failed!');
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
        const error = new Error('Error in finding the user!');
        error.code = 404;
        throw new error();
      }
      teacher.status = 'Inactive';
      return teacher.save();
    })
    .then(updatedTeacher => {
      if (!updatedTeacher) {
        const error = new Error('Error in saving the user!');
        error.code = 404;
        throw new error();
      }
      res.send({ user: updatedTeacher });
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
        const error = new Error('Error in finding the user!');
        error.code = 404;
        throw new error();
      }
      teacher.status = 'Active';
      return teacher.save();
    })
    .then(updatedTeacher => {
      if (!updatedTeacher) {
        const error = new Error('Error in saving the user!');
        error.code = 404;
        throw new error();
      }
      res.send({ user: updatedTeacher });
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
  const status = 'Active';

  const course = new Course({
    title: courseTitle,
    code: courseCode,
    credits: credits,
    status: status
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
