const bcrypt = require('bcryptjs');
const validator = require('validator');

const Teacher = require('../models/teacher');
const Course = require('../models/course');

exports.getAdmin = async (req, res, next) => {
  const userId = req.userId;
  const isAdmin = req.isAdmin;

  try {
    if (!isAdmin) {
      var error = new Error('Not Authorized!');
      error.status = 401;
      throw error;
    }

    const user = await Teacher.findById(userId).select('-password');

    if (!user) {
      var error = new Error('User not found!');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'User Fetched!', user: user });
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

// ================================================= Teachers Section ================================================

exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ type: { $ne: 'Admin' } });

    if (!teachers) {
      var error = new Error('Could not fetch teachers!');
      error.status = 404;
      throw error;
    }

    var totalteachers = 0;
    teachers.map(teacher => totalteachers++);

    res.status(200).json({
      message: 'Teachers fetched!',
      teachers: teachers,
      totalTeachers: totalteachers
    });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getTeacher = async (req, res, next) => {};

exports.createTeacher = async (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const rank = req.body.rank;
  const type = req.body.type;

  const role = ['Teacher'];
  const password = 'password';
  const status = 'Pending';
  const dpURL = 'undefined';
  const cvUrl = 'undefined';

  const errors = [];
  try {
    if (!validator.isEmail(teacherEmail)) {
      errors.push('Invalid teacher email!');
    }
    if (!validator.isAlphanumeric(teacherCode)) {
      errors.push('Invalid teacher code!');
    }
    if (!validator.isAlphanumeric(rank)) {
      errors.push('Invalid teacher rank!');
    }
    if (!validator.isAlpha(teacherType)) {
      errors.push('Invalid teacher type!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const teacher = new Teacher({
      email: teacherEmail,
      password: hashedPassword,
      teacherCode: teacherCode,
      status: status,
      rank: rank,
      type: type,
      dpURL: dpURL,
      cvUrl: cvUrl,
      role: role
    });

    const updatedTeacher = await teacher.save();
    if (!updatedTeacher) {
      const err = new Error('User creation failed!');
      err.code = 404;
      throw err;
    }
    res.status(200).json({ message: 'User Created!', teacher: updatedTeacher });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
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

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();

    if (!courses) {
      var error = new Error('Could not fetch courses!');
      error.status = 404;
      throw error;
    }

    var totalCourses = 0;
    courses.map(course => totalCourses++);

    res.status(200).json({
      message: 'Courses fetched!',
      courses: courses,
      totalCourses: totalCourses
    });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {};

exports.createCourse = async (req, res, next) => {
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const courseCredits = req.body.credits;
  const courseType = req.body.type;
  const courseSession = req.body.session;
  const status = 'Active';

  const errors = [];

  try {
    if (
      !validator.isAlphanumeric(validator.blacklist(courseTitle, ' ')) ||
      !validator.isLength(courseTitle, { min: 5 })
    ) {
      errors.push('Invalid course title!');
    }
    if (!validator.isAlphanumeric(courseCode)) {
      errors.push('Invalid course code!');
    }
    if (
      !validator.isNumeric(String(courseCredits)) ||
      !validator.isLength(String(courseCredits), { min: 1, max: 1 })
    ) {
      errors.push('Invalid course code!');
    }
    if (!validator.isAlpha(courseType)) {
      errors.push('Invalid course type!');
    }
    if (!validator.isAlpha(courseSession)) {
      errors.push('Invalid course session!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const courseFound = await Course.findOne({
      title: courseTitle,
      code: courseCode
    });
    if (courseFound) {
      var error = new Error('Course already exists!');
      error.status = 400;
      throw error;
    }

    const course = new Course({
      title: courseTitle,
      code: courseCode,
      credits: courseCredits,
      type: courseType,
      session: courseSession,
      status: status
    });

    const courseData = await course.save();

    if (!courseData) {
      const error = new Error('Course creation failed!');
      error.code = 404;
      throw error;
    }
    res.status(201).json({ message: 'Course created!', course: courseData });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  const courseId = req.body.courseId;
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const courseCredits = req.body.credits;
  const courseType = req.body.type;
  const courseSession = req.body.session;

  const errors = [];

  try {
    if (
      !validator.isAlphanumeric(validator.blacklist(courseTitle, ' ')) ||
      !validator.isLength(courseTitle, { min: 5 })
    ) {
      errors.push('Invalid course title!');
    }
    if (!validator.isAlphanumeric(courseCode)) {
      errors.push('Invalid course code!');
    }
    if (
      !validator.isNumeric(String(courseCredits)) ||
      !validator.isLength(String(courseCredits), { min: 1, max: 1 })
    ) {
      errors.push('Invalid course code!');
    }
    if (!validator.isAlpha(courseType)) {
      errors.push('Invalid course type!');
    }
    if (!validator.isAlpha(courseSession)) {
      errors.push('Invalid course session!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      const err = new Error('Course fetching failed!');
      err.code = 404;
      throw err;
    }

    if (course.status !== 'Active') {
      const err = new Error('Unable to update course');
      err.code = 404;
      throw err;
    }

    course.title = courseTitle;
    course.code = courseCode;
    course.credits = courseCredits;
    course.type = courseType;
    course.session = courseSession;

    const updatedCourse = await course.save();
    if (!updatedCourse) {
      const error = new Error('Error in saving the course!');
      error.code = 404;
      throw new error();
    }
    res.status(201).json({ message: 'Course Updated!', course: updatedCourse });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deactivateCourse = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Error in deleting the course!');
      error.code = 404;
      throw new error();
    }
    course.status = 'Inactive';
    const updatedCourse = await course.save();
    res
      .status(201)
      .json({ message: 'Course deactivated!', course: updatedCourse });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
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
