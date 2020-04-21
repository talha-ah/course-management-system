const { clearFile } = require('../utils/clearFile');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const PDFDocument = require('pdfkit');

const Teacher = require('../models/teacher');
const Course = require('../models/course');
const CourseLog = require('../models/nceac/courselog');
const CourseMonitoring = require('../models/nceac/coursemonitoring');
const CourseDescription = require('../models/nceac/coursedescription');
const Assignment = require('../models/materials/assignments');
const Quiz = require('../models/materials/quizzes');
const Paper = require('../models/materials/papers');

const Class = require('../models/class');

// =========================================================== Profile ================================================

exports.getTeacher = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const error = new Error('Unable to fetch the user.');
      error.status = 404;
      throw error;
    }

    res.status(200).send({
      message: 'Teacher fetched.',
      teacher: {
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        dob: teacher.dob,
        address: teacher.address,
        phone: teacher.phone,
      },
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  const teacherId = req.userId;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const dob = req.body.dob;
  const phone = req.body.phone;
  const address = req.body.address;
  const country = req.body.country;
  const city = req.body.city;
  const zip = req.body.zip;
  const errors = [];
  try {
    if (!validator.isAlphanumeric(firstName) || validator.isEmpty(firstName)) {
      errors.push('Invalid First Name!');
    }
    if (!validator.isAlphanumeric(lastName) || validator.isEmpty(lastName)) {
      errors.push('Invalid Last Name!');
    }
    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      errors.push('Invalid Email!');
    }
    if (!validator.isNumeric(String(phone)) || validator.isEmpty(phone)) {
      errors.push('Invalid Phone!');
    }
    if (!validator.isAlpha(country) || validator.isEmpty(country)) {
      errors.push('Invalid Country!');
    }
    if (!validator.isAlpha(city) || validator.isEmpty(city)) {
      errors.push('Invalid City!');
    }
    if (!validator.isAlphanumeric(zip) || validator.isEmpty(zip)) {
      errors.push('Invalid Zip!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }

    // if (req.file) {
    //   var dpURL = req.file.path;
    //   dpURL = dpURL.replace(/\\/g, '/');
    //   if (dpURL !== teacher.dpURL) {
    //     clearFile(teacher.dpURL);
    //     teacher.dpURL = dpURL;
    //   }
    // }

    teacher.firstName = firstName;
    teacher.lastName = lastName;
    teacher.email = email;
    teacher.dob = dob;
    teacher.phone = phone;
    teacher.address.address = address;
    teacher.address.country = country;
    teacher.address.city = city;
    teacher.address.zip = zip;
    teacher.status = 'Active';

    const updatedTeacher = await teacher.save();

    res.status(201).send({
      message: 'Profile Updated',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl,
      },
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editProfilePassword = async (req, res, next) => {
  const teacherId = req.userId;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const errors = [];

  try {
    if (
      !validator.isLength(newPassword, { min: 6 }) ||
      validator.isEmpty(newPassword)
    ) {
      errors.push('Invalid New Password Length!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }

    const passwordCheck = await bcrypt.compare(
      currentPassword,
      teacher.password
    );
    if (!passwordCheck) {
      var error = new Error('Wrong password!');
      error.status = 403;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    teacher.password = hashedPassword;

    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Password updated!',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl,
      },
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editCV = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    if (req.file.mimetype !== 'application/pdf') {
      var error = new Error('File type not PDF!.');
      error.status = 400;
      throw error;
    }
    var cvPath = req.file.path;
    if (!cvPath || !req.file) {
      const err = new Error('No file provided!');
      err.status = 204;
      throw err;
    }
    cvPath = cvPath.replace(/\\/g, '/');
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 404;
      throw err;
    }
    if (teacher.cvUrl !== 'undefined' || !teacher.cvUrl) {
      clearFile(teacher.cvUrl);
    }
    teacher.cvUrl = cvPath;
    const updatedTeacher = await teacher.save();
    res.status(201).json({
      message: 'CV Updated!',
      teacher: {
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        email: updatedTeacher.email,
        dob: updatedTeacher.dob,
        address: updatedTeacher.address,
        phone: updatedTeacher.phone,
        cvPath: updatedTeacher.cvUrl,
      },
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== Courses ================================================

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().select('title status');
    // const courses = await Course.find({ status: 'Active' }).select(
    //   'title -_id'
    // );
    // OR .find({}).select({ "name": 1, "_id": 0});

    if (!courses) {
      var error = new Error('Unable to fetch the courses');
      error.status = 400;
      throw error;
    }

    res.status(200).json({ message: 'Courses fetched!', courses: courses });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);
    var getCourse;
    teacher.coursesAssigned.map((course) => {
      if (course._id.toString() === courseId.toString()) {
        getCourse = course;
      }
    });

    const course = await Course.findById(getCourse.courseId);
    const courseLog = await CourseLog.find(getCourse.courseLog);
    const courseDescription = await CourseDescription.find(
      getCourse.courseDescription
    );
    const courseMonitoring = await CourseMonitoring.find(
      getCourse.courseMonitoring
    );
    const assignments = await Assignment.find(getCourse.assignments);
    const papers = await Paper.find(getCourse.papers);
    const quizzes = await Quiz.find(getCourse.quizzes);

    const updatedCourse = {
      course: {
        _id: courseId,
        courseId: course._id,
        title: course.title,
        code: course.code,
        type: course.type,
        sessionType: course.session,
        sections: getCourse.sections,
        session: getCourse.session,
        status: getCourse.status,
      },
      courseLog: courseLog,
      courseDescription: courseDescription,
      courseMonitoring: courseMonitoring,
      assignments: assignments,
      papers: papers,
      quizzes: quizzes,
    };
    res.status(200).json({ message: 'Course fetched!', course: updatedCourse });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getTeacherCourses = async (req, res, next) => {
  const teacherId = req.userId;

  try {
    const teacher = await Teacher.findById(teacherId)
      .populate('coursesAssigned.courseId')
      .exec();

    if (!teacher) {
      const error = new Error('Error in fetching the teacher!');
      error.code = 404;
      throw new error();
    }

    var courses = teacher.coursesAssigned;

    var totalCourses = 0;
    if (courses) {
      totalCourses = courses.length;
    }

    var updatedCourses = [];

    courses.map((course) => {
      updatedCourses.push({
        _id: course._id,
        courseId: course.courseId._id,
        title: course.courseId.title,
        code: course.courseId.code,
        credits: course.courseId.credits,
        type: course.courseId.type,
        sessionType: course.courseId.session,
        status: course.status,
        sections: course.sections,
        session: course.session,
      });
    });

    res.status(200).json({
      message: 'Courses fetched!',
      courses: updatedCourses,
      totalCourses: totalCourses,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.takeCourse = async (req, res, next) => {
  const teacherId = req.userId;

  const courseId = req.body.courseId;
  const sections = req.body.sections;
  const session2 = req.body.session;
  const errors = [];
  try {
    if (sections.length <= 0) {
      errors.push('Invalid sections!');
    }
    if (
      !validator.isNumeric(String(session2)) ||
      validator.isEmpty(String(session2)) ||
      session2 < 2010
    ) {
      errors.push('Invalid session!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const session = session2 + '-' + (session2 + 4);
    const course = await Teacher.find({
      _id: teacherId,
      'coursesAssigned.courseId': courseId,
      'coursesAssigned.session': session,
    });

    if (course.length > 0) {
      const error = new Error('Course already exists!');
      error.status = 400;
      throw error;
    }

    const courseLog = new CourseLog({
      courseId: courseId,
      teacherId: teacherId,
    });
    const courseMonitoring = new CourseMonitoring({
      courseId: courseId,
      teacherId: teacherId,
    });
    const courseDescription = new CourseDescription({
      courseId: courseId,
      teacherId: teacherId,
    });

    const courseLogDoc = await courseLog.save();
    const courseDescriptionDoc = await courseDescription.save();
    const courseMonitoringDoc = await courseMonitoring.save();

    const assignment = new Assignment({
      courseId: courseId,
      teacherId: teacherId,
    });
    const quiz = new Quiz({
      courseId: courseId,
      teacherId: teacherId,
    });
    const paper = new Paper({
      courseId: courseId,
      teacherId: teacherId,
    });

    const assignmentDoc = await assignment.save();
    const quizDoc = await quiz.save();
    const paperDoc = await paper.save();

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const error = new Error('Error in fetching the teacher!');
      error.code = 404;
      throw error;
    }

    teacher.coursesAssigned.push({
      courseId: courseId,
      sections: sections,
      session: session,
      status: 'Active',
      courseLog: courseLogDoc._id,
      courseDescription: courseDescriptionDoc._id,
      courseMonitoring: courseMonitoringDoc._id,
      assignments: assignmentDoc._id,
      quizzes: quizDoc._id,
      papers: paperDoc._id,
    });
    const teacherData = await teacher.save();

    if (!teacherData) {
      const error = new Error('Error in saving the teacher!');
      error.code = 404;
      throw new error();
    }
    res.status(201).json({ message: 'Course added!', teacher: teacherData });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editCourse = async (req, res, next) => {
  const teacherId = req.userId;

  const courseId = req.body.courseId;
  // const session = req.body.session;
  const sections = req.body.sections;

  const errors = [];
  try {
    // if (
    //   !validator.isAlphanumeric(validator.blacklist(sections, ' ,')) ||
    //   validator.isEmpty(sections)
    // ) {
    //   errors.push('Invalid sections!');
    // }
    // if (errors.length > 0) {
    //   var error = new Error(errors);
    //   error.status = 400;
    //   throw error;
    // }
    const teacher = await Teacher.findById(teacherId);

    const courseArray = [...teacher.coursesAssigned];

    const courseIndex = teacher.coursesAssigned.findIndex((ci) => {
      return ci._id.toString() === courseId.toString();
    });

    var getCourse;
    teacher.coursesAssigned.map((course) => {
      if (course._id.toString() === courseId.toString()) {
        getCourse = course;
      }
    });

    getCourse.sections = sections;
    courseArray[courseIndex] = getCourse;
    teacher.coursesAssigned = courseArray;

    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Course Updated!',
      course: getCourse,
      updatedTeacher: updatedTeacher,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.disableCourse = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    var courseArray = [...teacher.coursesAssigned];

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    var getCourse = courseArray[courseIndex];

    getCourse.status = 'Inactive';
    courseArray[courseIndex] = getCourse;
    teacher.coursesAssigned = courseArray;

    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Course disabled!',
      updatedTeacher: updatedTeacher,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.removeCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  const teacherId = req.userId;

  try {
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      {
        $pull: { coursesAssigned: { _id: courseId } },
      }
      // { new: true }
    );
    if (!teacher) {
      const error = new Error('Error in removing course from the teacher!');
      error.code = 404;
      throw new error();
    }

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    await CourseLog.findByIdAndDelete(course.courseLog);
    await CourseMonitoring.findByIdAndDelete(course.courseMonitoring);
    await CourseDescription.findByIdAndDelete(course.courseDescription);
    await Assignment.findByIdAndDelete(course.assignments);
    await Quiz.findByIdAndDelete(course.quizzes);
    await Paper.findByIdAndDelete(course.papers);

    res.status(201).json({
      message: 'Course deleted.',
      teacher: teacher,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== NCEAC Forms ================================================

exports.getCourseLog = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const courseLog = await CourseLog.findById(course.courseLog);

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw error;
    }

    res
      .status(200)
      .json({ message: 'CourseLog fetched!', courseLog: courseLog });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseLog = async (req, res, next) => {
  const courseLogId = req.params.logId;
  const teacherId = req.userId;

  const date = req.body.date;
  const duration = req.body.duration;
  const topics = req.body.topics;
  const instruments = req.body.instruments;

  const errors = [];
  try {
    if (validator.isEmpty(topics)) {
      errors.push('Invalid topics!');
    }
    if (validator.isEmpty(instruments)) {
      errors.push('Invalid instruments!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const courseLog = await CourseLog.findById(courseLogId);

    if (courseLog.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Teacher ID error in course log!');
      error.code = 404;
      throw error;
    }

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw error;
    }

    courseLog.log.push({
      date: date,
      duration: duration,
      topics: topics,
      instruments: instruments,
    });

    const courseLogDoc = await courseLog.save();

    res.status(201).json({ message: 'Log created!', courseLog: courseLogDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getCourseMonitoring = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const courseMonitor = await CourseMonitoring.findById(
      course.courseMonitoring
    );

    if (!courseMonitor) {
      const error = new Error('Error in fetching course monitoring!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Course Monitoring fetched!',
      courseMonitoring: courseMonitor,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseMonitoring = async (req, res, next) => {
  const teacherId = req.userId;
  const monitorId = req.params.monitorId;

  const howFar = req.body.howFar;
  const fullCover = req.body.fullCover;
  const relevantProblems = req.body.relevantProblems;
  const assessStandard = req.body.assessStandard;
  const emergeApplication = req.body.emergeApplication;
  const errors = [];
  try {
    if (
      validator.isEmpty(howFar) ||
      validator.isEmpty(fullCover) ||
      validator.isEmpty(relevantProblems) ||
      validator.isEmpty(assessStandard) ||
      validator.isEmpty(emergeApplication)
    ) {
      errors.push('Invalid fields!');
    }

    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const courseMonitoring = await CourseMonitoring.findById(monitorId);

    if (!courseMonitoring) {
      const error = new Error('Error in fetching courseMonitoring!');
      error.code = 404;
      throw error;
    }

    if (courseMonitoring.teacherId.toString() !== teacherId.toString()) {
      const error = new Error(
        'Error in validating teacher Id in courseMonitoring!'
      );
      error.code = 404;
      throw error;
    }

    courseMonitoring.data.howFar = howFar;
    courseMonitoring.data.fullCover = fullCover;
    courseMonitoring.data.relevantProblems = relevantProblems;
    courseMonitoring.data.assessStandard = assessStandard;
    courseMonitoring.data.emergeApplication = emergeApplication;
    courseMonitoring.status = 'Old';

    const courseMonitoringDoc = await courseMonitoring.save();

    res.status(201).json({
      message: 'Course monitoring saved!',
      courseMonitoring: courseMonitoringDoc,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getCourseDescription = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const courseDescription = await CourseDescription.findById(
      course.courseDescription
    );

    if (!courseDescription) {
      const error = new Error('Error in fetching course description!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Course Description fetched!',
      courseDescription: courseDescription,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseDescription = async (req, res, next) => {
  const teacherId = req.userId;
  const descriptionId = req.params.descriptionId;
  const phase = req.body.phase;

  if (phase === 'phase1') {
    const prerequisites = req.body.prerequisites;
    const assignments = req.body.assignments;
    const quizzes = req.body.quizzes;
    const mid = req.body.midTerm;
    const final = req.body.finalTerm;
    const coordinator = req.body.coordinator;
    const url = req.body.url;
    const catalog = req.body.catalog;
    const textbook = req.body.textbook;
    const reference = req.body.reference;
    const goals = req.body.goals;
    const errors = [];
    try {
      if (
        validator.isEmpty(prerequisites) ||
        validator.isEmpty(String(assignments)) ||
        validator.isEmpty(String(quizzes)) ||
        validator.isEmpty(String(mid)) ||
        validator.isEmpty(String(final)) ||
        validator.isEmpty(coordinator) ||
        validator.isEmpty(catalog) ||
        validator.isEmpty(textbook) ||
        validator.isEmpty(reference) ||
        validator.isEmpty(goals)
      ) {
        errors.push('Invalid fields!');
      }

      if (errors.length > 0) {
        var error = new Error(errors);
        error.status = 400;
        throw error;
      }

      const courseDescription = await CourseDescription.findById(descriptionId);

      if (!courseDescription) {
        const error = new Error('Error in fetching courseDescription!');
        error.code = 404;
        throw error;
      }

      if (courseDescription.teacherId.toString() !== teacherId.toString()) {
        const error = new Error(
          'Error in validating teacher Id in courseDescription!'
        );
        error.code = 404;
        throw error;
      }

      courseDescription.data.prerequisites = prerequisites;
      courseDescription.data.assessment.assignments = assignments;
      courseDescription.data.assessment.quizzes = quizzes;
      courseDescription.data.assessment.mid = mid;
      courseDescription.data.assessment.final = final;
      courseDescription.data.coordinator = coordinator;
      courseDescription.data.url = url;
      courseDescription.data.catalog = catalog;
      courseDescription.data.textbook = textbook;
      courseDescription.data.reference = reference;
      courseDescription.data.goals = goals;
      courseDescription.status = 'pending';

      const courseDescriptionDoc = await courseDescription.save();

      res.status(201).json({
        message: 'Course description phase 1 saved!',
        courseDescription: courseDescriptionDoc,
      });
    } catch (err) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  } else {
    const topicsCovered = req.body.topicsCovered;
    const laboratory = req.body.laboratory;
    const programming = req.body.programming;
    const theory = req.body.theory;
    const problemAnalysis = req.body.problem;
    const solutionDesign = req.body.solution;
    const socialAndEthicalIssues = req.body.social;
    const oralWritten = req.body.oralWritten;
    const errors = [];
    try {
      if (
        validator.isEmpty(topicsCovered) ||
        validator.isEmpty(laboratory) ||
        validator.isEmpty(programming) ||
        validator.isEmpty(String(theory)) ||
        validator.isEmpty(String(problemAnalysis)) ||
        validator.isEmpty(String(solutionDesign)) ||
        validator.isEmpty(String(socialAndEthicalIssues)) ||
        validator.isEmpty(oralWritten)
      ) {
        errors.push('Invalid fields!');
      }

      if (errors.length > 0) {
        var error = new Error(errors);
        error.status = 400;
        throw error;
      }

      const courseDescription = await CourseDescription.findById(descriptionId);

      if (!courseDescription) {
        const error = new Error('Error in fetching courseDescription!');
        error.code = 404;
        throw error;
      }

      if (courseDescription.teacherId.toString() !== teacherId.toString()) {
        const error = new Error(
          'Error in validating teacher Id in courseDescription!'
        );
        error.code = 404;
        throw error;
      }

      courseDescription.data.topicsCovered = topicsCovered;
      courseDescription.data.laboratory = laboratory;
      courseDescription.data.programming = programming;
      courseDescription.data.classTime.theory = theory;
      courseDescription.data.classTime.problemAnalysis = problemAnalysis;
      courseDescription.data.classTime.solutionDesign = solutionDesign;
      courseDescription.data.classTime.socialAndEthicalIssues = socialAndEthicalIssues;
      courseDescription.data.oralWritten = oralWritten;
      courseDescription.status = 'complete';

      const courseDescriptionDoc = await courseDescription.save();

      res.status(201).json({
        message: 'Course description phase 2 saved!',
        courseDescription: courseDescriptionDoc,
      });
    } catch (err) {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    }
  }
};

// =========================================================== Materials ==================================================

exports.getAssignments = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const assignments = await Assignment.findById(course.assignments);

    if (!assignments) {
      const error = new Error('Error in fetching course assignments!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Course Assignments fetched!',
      assignments: assignments,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addAssignment = async (req, res, next) => {
  const teacherId = req.userId;
  const assignmentId = req.params.assignmentId;

  const title = req.body.title;
  const marks = req.body.marks;
  const batch = req.body.batch;
  const section = req.body.section;
  const assessment = req.body.prePost;
  var assignmentPath = req.files['assignment'][0].path;
  const assignmentFileName = req.files['assignment'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (validator.isEmpty(title)) {
      errors.push('Invalid title!');
    }
    if (validator.isEmpty(batch)) {
      errors.push('Invalid session!');
    }
    if (!validator.isAlphanumeric(section) || validator.isEmpty(section)) {
      errors.push('Invalid section!');
    }
    if (
      !validator.isNumeric(String(marks)) ||
      validator.isEmpty(String(marks))
    ) {
      errors.push('Invalid marks!');
    }
    if (assessment !== 'Pre-Mid' && assessment !== 'Post-Mid') {
      errors.push('Invalid assessment field!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }
    if (!assignmentPath && !req.files['assignment'][0]) {
      const err = new Error('Assignment file required!');
      err.status = 204;
      throw err;
    }

    if (!solutionPath && !req.files['solution'][0]) {
      const err = new Error('Solution file required!');
      err.status = 204;
      throw err;
    }

    assignmentPath = assignmentPath.replace(/\\/g, '/');
    solutionPath = solutionPath.replace(/\\/g, '/');

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      const err = new Error('Could not find assignment doc.');
      err.status = 404;
      throw err;
    }

    if (assignment.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Teacher ID error in assignment doc!');
      error.code = 404;
      throw error;
    }

    assignment.assignments.map((ele) => {
      if (ele.title === title && ele.section === section) {
        const error = new Error(
          'Assignment with this title and section already exists!'
        );
        error.code = 404;
        throw error;
      }
    });

    assignment.assignments.push({
      title: title,
      marks: marks,
      batch: batch,
      section: section,
      assessment: assessment,
      assignment: { name: assignmentFileName, path: assignmentPath },
      solution: { name: solutionFileName, path: solutionPath },
    });

    const assignmentDoc = await assignment.save();

    res
      .status(201)
      .json({ message: 'Assignment saved.', assignments: assignmentDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getAssignmentResult = async (req, res, next) => {
  const teacherId = req.userId;
  const assignmentDocId = req.params.assignmentDocId;
  const assignmentId = req.params.assignmentId;
  try {
    const assignmentDoc = await Assignment.findById(assignmentDocId);

    if (!assignmentDoc) {
      const error = new Error('Whoops, could not find the assignment.');
      error.status = 404;
      throw error;
    }

    if (assignmentDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your assignment!');
      error.status = 404;
      throw error;
    }

    const assignmentIndex = assignmentDoc.assignments.findIndex((a) => {
      return a._id.toString() === assignmentId.toString();
    });

    const assignment = assignmentDoc.assignments[assignmentIndex];

    if (!assignment) {
      const error = new Error('Whoops, error in fetching assignment!');
      error.code = 404;
      throw error;
    }

    res
      .status(200)
      .json({ message: 'Assignment fetched.', material: assignment });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

exports.addAssignmentResult = async (req, res, next) => {
  const teacherId = req.userId;
  const assignmentDocId = req.params.assignmentDocId;
  const assignmentId = req.params.assignmentId;
  const data = req.body.data;

  try {
    const assignmentDoc = await Assignment.findById(assignmentDocId);

    if (!assignmentDoc) {
      const error = new Error('Whoops, could not find the assignment.');
      error.status = 404;
      throw error;
    }

    if (assignmentDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your assignment!');
      error.status = 404;
      throw error;
    }

    const assignmentIndex = assignmentDoc.assignments.findIndex((a) => {
      return a._id.toString() === assignmentId.toString();
    });

    const assignment = assignmentDoc.assignments[assignmentIndex];

    if (!assignment) {
      const error = new Error('Whoops, error in fetching assignment!');
      error.code = 404;
      throw error;
    }

    assignment.result = data;
    assignment.resultAdded = true;
    const savedAssignmentDoc = await assignmentDoc.save();
    const result = savedAssignmentDoc.assignments[assignmentIndex];
    res.status(200).json({
      message: 'Marks saved.',
      savedMaterial: result,
    });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

exports.getQuizzes = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const quizzes = await Quiz.findById(course.quizzes);

    if (!quizzes) {
      const error = new Error('Error in fetching course quizzes!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Course quizzes fetched!',
      quizzes: quizzes,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addQuiz = async (req, res, next) => {
  const teacherId = req.userId;
  const quizId = req.params.quizId;

  const title = req.body.title;
  const marks = req.body.marks;
  const batch = req.body.batch;
  const section = req.body.section;
  const assessment = req.body.prePost;
  var quizPath = req.files['quiz'][0].path;
  const quizFileName = req.files['quiz'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (validator.isEmpty(title)) {
      errors.push('Invalid title!');
    }
    if (validator.isEmpty(batch)) {
      errors.push('Invalid session!');
    }
    if (!validator.isAlphanumeric(section) || validator.isEmpty(section)) {
      errors.push('Invalid section!');
    }
    if (
      !validator.isNumeric(String(marks)) ||
      validator.isEmpty(String(marks))
    ) {
      errors.push('Invalid markss!');
    }
    if (assessment !== 'Pre-Mid' && assessment !== 'Post-Mid') {
      errors.push('Invalid assessment field!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }
    if (!quizPath && !req.files['quiz'][0]) {
      const err = new Error('Quiz file required!');
      err.status = 204;
      throw err;
    }

    if (!solutionPath && !req.files['solution'][0]) {
      const err = new Error('Solution file required!');
      err.status = 204;
      throw err;
    }

    quizPath = quizPath.replace(/\\/g, '/');
    solutionPath = solutionPath.replace(/\\/g, '/');

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new Error('Could not find quiz doc.');
      err.status = 404;
      throw err;
    }

    if (quiz.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Teacher ID error in quiz doc!');
      error.code = 404;
      throw error;
    }

    quiz.quizzes.map((ele) => {
      if (ele.title === title && ele.section === section) {
        const error = new Error(
          'Quiz with this title and section already exists!'
        );
        error.code = 404;
        throw error;
      }
    });

    quiz.quizzes.push({
      title: title,
      marks: marks,
      batch: batch,
      section: section,
      assessment: assessment,
      quiz: { name: quizFileName, path: quizPath },
      solution: { name: solutionFileName, path: solutionPath },
    });

    const quizDoc = await quiz.save();

    res.status(201).json({ message: 'Quiz saved.', quizzes: quizDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getQuizResult = async (req, res, next) => {
  const teacherId = req.userId;
  const quizDocId = req.params.quizDocId;
  const quizId = req.params.quizId;
  try {
    const quizDoc = await Quiz.findById(quizDocId);

    if (!quizDoc) {
      const error = new Error('Whoops, could not find the quiz.');
      error.status = 404;
      throw error;
    }

    if (quizDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your quiz!');
      error.status = 404;
      throw error;
    }

    const quizIndex = quizDoc.quizzes.findIndex((a) => {
      return a._id.toString() === quizId.toString();
    });

    const quiz = quizDoc.quizzes[quizIndex];

    if (!quiz) {
      const error = new Error('Whoops, error in fetching quiz!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({ message: 'Quiz fetched.', material: quiz });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

exports.addQuizResult = async (req, res, next) => {
  const teacherId = req.userId;
  const quizDocId = req.params.quizDocId;
  const quizId = req.params.quizId;
  const data = req.body.data;
  try {
    const quizDoc = await Quiz.findById(quizDocId);

    if (!quizDoc) {
      const error = new Error('Whoops, could not find the quiz.');
      error.status = 404;
      throw error;
    }

    if (quizDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your quiz!');
      error.status = 404;
      throw error;
    }

    const quizIndex = quizDoc.quizzes.findIndex((a) => {
      return a._id.toString() === quizId.toString();
    });

    const quiz = quizDoc.quizzes[quizIndex];

    if (!quiz) {
      const error = new Error('Whoops, error in fetching quiz!');
      error.code = 404;
      throw error;
    }

    quiz.result = data;
    quiz.resultAdded = true;
    const savedQuizDoc = await quizDoc.save();
    const result = savedQuizDoc.quizzes[quizIndex];
    res.status(200).json({
      message: 'Marks saved.',
      savedMaterial: result,
    });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

exports.getPapers = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex((c) => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error;
    }

    const papers = await Paper.findById(course.papers);

    if (!papers) {
      const error = new Error('Error in fetching course papers!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Course papers fetched!',
      papers: papers,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addPaper = async (req, res, next) => {
  const teacherId = req.userId;
  const paperId = req.params.paperId;

  const title = req.body.title;
  const marks = req.body.marks;
  const batch = req.body.batch;
  const section = req.body.section;
  const assessment = req.body.prePost;
  var paperPath = req.files['paper'][0].path;
  const paperFileName = req.files['paper'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (validator.isEmpty(title)) {
      errors.push('Invalid title!');
    }
    if (validator.isEmpty(batch)) {
      errors.push('Invalid session!');
    }
    if (!validator.isAlphanumeric(section) || validator.isEmpty(batch)) {
      errors.push('Invalid section!');
    }
    if (
      !validator.isNumeric(String(marks)) ||
      validator.isEmpty(String(marks))
    ) {
      errors.push('Invalid markss!');
    }
    if (assessment !== 'Mid-Term' && assessment !== 'Final-Term') {
      errors.push('Invalid assessment field!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }
    if (!paperPath && !req.files['paper'][0]) {
      const err = new Error('Paper file required!');
      err.status = 204;
      throw err;
    }

    if (!solutionPath && !req.files['solution'][0]) {
      const err = new Error('Solution file required!');
      err.status = 204;
      throw err;
    }

    paperPath = paperPath.replace(/\\/g, '/');
    solutionPath = solutionPath.replace(/\\/g, '/');

    const paper = await Paper.findById(paperId);

    if (!paper) {
      const err = new Error('Could not find paper doc.');
      err.status = 404;
      throw err;
    }

    if (paper.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Teacher ID error in paper doc!');
      error.code = 404;
      throw error;
    }

    paper.papers.map((ele) => {
      if (ele.title === title && ele.section === section) {
        const error = new Error(
          'Paper with this title and section already exists!'
        );
        error.code = 404;
        throw error;
      }
    });

    paper.papers.push({
      title: title,
      marks: marks,
      batch: batch,
      section: section,
      assessment: assessment,
      paper: { name: paperFileName, path: paperPath },
      solution: { name: solutionFileName, path: solutionPath },
    });

    const paperDoc = await paper.save();

    res.status(201).json({ message: 'Paper saved.', papers: paperDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getPaperResult = async (req, res, next) => {
  const teacherId = req.userId;
  const paperDocId = req.params.paperDocId;
  const paperId = req.params.paperId;
  try {
    const paperDoc = await Paper.findById(paperDocId);

    if (!paperDoc) {
      const error = new Error('Whoops, could not find the paper.');
      error.status = 404;
      throw error;
    }

    if (paperDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your paper!');
      error.status = 404;
      throw error;
    }

    const paperIndex = paperDoc.papers.findIndex((a) => {
      return a._id.toString() === paperId.toString();
    });

    const paper = paperDoc.papers[paperIndex];

    if (!paper) {
      const error = new Error('Whoops, error in fetching paper!');
      error.code = 404;
      throw error;
    }

    res.status(200).json({ message: 'paper fetched.', material: paper });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

exports.addPaperResult = async (req, res, next) => {
  const teacherId = req.userId;
  const paperDocId = req.params.paperDocId;
  const paperId = req.params.paperId;
  const data = req.body.data;
  try {
    const paperDoc = await Paper.findById(paperDocId);

    if (!paperDoc) {
      const error = new Error('Whoops, could not find the paper.');
      error.status = 404;
      throw error;
    }

    if (paperDoc.teacherId.toString() !== teacherId.toString()) {
      const error = new Error('Whoops, this is not your paper!');
      error.status = 404;
      throw error;
    }

    const paperIndex = paperDoc.papers.findIndex((a) => {
      return a._id.toString() === paperId.toString();
    });

    const paper = paperDoc.papers[paperIndex];

    if (!paper) {
      const error = new Error('Whoops, error in fetching paper!');
      error.code = 404;
      throw error;
    }

    paper.result = data;
    paper.resultAdded = true;
    const savedPaperDoc = await paperDoc.save();
    const result = savedPaperDoc.papers[paperIndex];
    res.status(200).json({
      message: 'Marks saved.',
      savedMaterial: result,
    });
  } catch (err) {
    if (!err.status) err.status = 500;
    next(err);
  }
};

// Grades

exports.addAssignmentGrades = async (req, res, next) => {
  const teacherId = req.userId;
  const assignmentDocId = req.params.assignmentDocId;
  const data = req.body.data;

  try {
    const assignment = await Assignment.findById(assignmentDocId);

    if (!assignment) {
      const err = new Error('Could not find assignment doc.');
      err.status = 404;
      throw err;
    }
    if (assignment.teacherId.toString() !== teacherId.toString()) {
      const err = new Error('Whoops, not authorized to add grades.');
      err.status = 404;
      throw err;
    }

    const section = Object.keys(data)[0];

    assignment.grades = { ...assignment.grades, [section]: data[section] };

    const assignmentUpdated = await assignment.save();

    res.status(201).json({
      message: 'Assignment grades submitted.',
      assignment: assignmentUpdated,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addQuizGrades = async (req, res, next) => {
  const teacherId = req.userId;
  const quizDocId = req.params.quizDocId;
  const data = req.body.data;

  try {
    const quiz = await Quiz.findById(quizDocId);
    if (!quiz) {
      const err = new Error('Could not find quiz doc.');
      err.status = 404;
      throw err;
    }
    if (quiz.teacherId.toString() !== teacherId.toString()) {
      const err = new Error('Whoops, not authorized to add grades.');
      err.status = 404;
      throw err;
    }
    // quiz.grades = data;
    const section = Object.keys(data)[0];

    quiz.grades = { ...quiz.grades, [section]: data[section] };

    const quizUpdated = await quiz.save();

    res.status(201).json({
      message: 'Quiz grades submitted.',
      quiz: quizUpdated,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.generateReport = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.teacherCourseId;
  const batch = req.params.batch;
  const semester = req.params.semester;
  const section = req.params.section;

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    const err = new Error('Whoops, could not find the teacher!.');
    err.status = 404;
    throw err;
  }
  const courseIndex = teacher.coursesAssigned.findIndex((c) => {
    return c._id.toString() === courseId.toString();
  });

  const course = teacher.coursesAssigned[courseIndex];

  if (!course) {
    const error = new Error('Error in fetching course!');
    error.code = 404;
    throw error;
  }

  const adminCourseId = course.courseId;
  const assignmentDocId = course.assignments;
  const quizDocId = course.quizzes;
  const paperDocId = course.papers;

  try {
    const adminCourse = await Course.findById(adminCourseId);
    if (!adminCourse) {
      const error = new Error('Error in fetching base course!');
      error.code = 404;
      throw error;
    }
    const assignmentDoc = await Assignment.findById(assignmentDocId);
    if (!assignmentDoc) {
      const error = new Error('Error in fetching assignment!');
      error.code = 404;
      throw error;
    }
    const quizDoc = await Quiz.findById(quizDocId);
    if (!quizDoc) {
      const error = new Error('Error in fetching base quiz!');
      error.code = 404;
      throw error;
    }
    const paperDoc = await Paper.findById(paperDocId);
    if (!paperDoc) {
      const error = new Error('Error in fetching base paper!');
      error.code = 404;
      throw error;
    }

    const sessionTime = adminCourse.session;
    const courseTitle = adminCourse.title;
    const courseCode = adminCourse.code;

    var data = {
      quiz: {},
      assignment: {},
      midTerm: {},
      finalTerm: {},
    };

    var quizCount = 0;
    quizDoc.quizzes.map((quiz) => {
      if (quiz.section.toString() === section.toString()) {
        quizCount++;
      }
    });
    if (Object.keys(quizDoc.grades[section.toString()]).length !== quizCount) {
      const error = new Error('Please grade every quiz first.');
      error.code = 404;
      throw error;
    }
    var assignmentCount = 0;
    assignmentDoc.assignments.map((assignment) => {
      if (assignment.section.toString() === section.toString()) {
        assignmentCount++;
      }
    });
    if (
      Object.keys(assignmentDoc.grades[section.toString()]).length !==
      assignmentCount
    ) {
      const error = new Error('Please grade every assignment first.');
      error.code = 404;
      throw error;
    }

    quizDoc.quizzes.map((quiz) => {
      if (quiz.section.toString() === section.toString()) {
        if (quiz.resultAdded) {
          var grade;
          Object.entries(quizDoc.grades[section.toString()]).map((ele) => {
            if (quiz._id.toString() === ele[0].toString()) {
              grade = ele[1];
            }
          });
          var check = { ...data.quiz };
          Object.entries(quiz.result).map((ent) => {
            var num = (+ent[1] / +quiz.marks) * 100;
            var num2 = (+num * +grade) / 100;
            var num3 = Math.round((+num2 + Number.EPSILON) * 10) / 10;
            check[ent[0]] = check[ent[0]] ? +check[ent[0]] + +num3 : +num3;
          });
          data = { ...data, quiz: check };
        } else {
          const error = new Error(`${quiz.title}'s result needs to be added.`);
          error.status = 404;
          throw error;
        }
      }
    });
    assignmentDoc.assignments.map((assignment) => {
      if (assignment.section.toString() === section.toString()) {
        if (assignment.resultAdded) {
          var grade;
          Object.entries(assignmentDoc.grades[section.toString()]).map(
            (ele) => {
              if (assignment._id.toString() === ele[0].toString()) {
                grade = ele[1];
              }
            }
          );
          var check = { ...data.assignment };
          Object.entries(assignment.result).map((ent) => {
            var num = (+ent[1] / +assignment.marks) * 100;
            var num2 = (+num * +grade) / 100;
            var num3 = Math.round((+num2 + Number.EPSILON) * 10) / 10;
            check[ent[0]] = check[ent[0]] ? +check[ent[0]] + +num3 : +num3;
          });
          data = { ...data, assignment: check };
        } else {
          const error = new Error(`${quiz.title}'s result needs to be added.`);
          error.status = 404;
          throw error;
        }
      }
    });
    paperDoc.papers.map((paper) => {
      if (paper.section.toString() === section.toString()) {
        if (paper.resultAdded) {
          if (paper.assessment === 'Mid-Term') {
            var check = { ...data.midTerm };
            Object.entries(paper.result).map((ent) => {
              check[ent[0]] = check[ent[0]]
                ? +check[ent[0]] + +ent[1]
                : +ent[1];
            });
            data = { ...data, midTerm: check };
          } else if (paper.assessment === 'Final-Term') {
            var check = { ...data.finalTerm };
            Object.entries(paper.result).map((ent) => {
              check[ent[0]] = check[ent[0]]
                ? +check[ent[0]] + +ent[1]
                : +ent[1];
            });
            data = { ...data, finalTerm: check };
          } else {
            const error = new Error(
              `Whoops, there is something wrong with ${paper.title}'s assessment.`
            );
            error.status = 404;
            throw error;
          }
        } else {
          const error = new Error(`${paper.title}'s result needs to be added.`);
          error.status = 404;
          throw error;
        }
      }
    });

    const fetchClass = await Class.findOne({
      batch: batch,
      section: section,
    });

    if (!fetchClass) {
      const error = new Error('Whoops, could not find the class.');
      error.status = 404;
      throw error;
    }

    const info = {
      batch: batch,
      section: section,
      semester: semester,
      session: sessionTime,
      title: courseTitle,
      code: courseCode,
    };
    var data2 = [];
    fetchClass.students.map((student) => {
      data2.push({
        rollNumber: student.rollNumber,
        studentName: student.fullName,
        quiz: data.quiz[student.rollNumber],
        termPaper: data.assignment[student.rollNumber],
        midSemester: data.midTerm[student.rollNumber],
        sessionalTotal:
          +data.quiz[student.rollNumber] + +data.assignment[student.rollNumber],
        finalExam: data.finalTerm[student.rollNumber],
        totalMarks:
          +data.quiz[student.rollNumber] +
          +data.assignment[student.rollNumber] +
          +data.midTerm[student.rollNumber] +
          +data.finalTerm[student.rollNumber],
      });
    });
    res.status(200).json({ info: info, data: data2 });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
