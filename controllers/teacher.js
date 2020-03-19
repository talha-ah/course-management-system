const { clearFile } = require('../utils/clearFile');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Teacher = require('../models/teacher');
const Course = require('../models/course');
const CourseLog = require('../models/nceac/courselog');
const CourseMonitoring = require('../models/nceac/coursemonitoring');
const CourseDescription = require('../models/nceac/coursedescription');
const Assignment = require('../models/materials/assignments');
const Quiz = require('../models/materials/quizzes');
const Paper = require('../models/materials/papers');

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
        phone: teacher.phone
      }
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
        cvPath: updatedTeacher.cvUrl
      }
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
        cvPath: updatedTeacher.cvUrl
      }
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
        cvPath: updatedTeacher.cvUrl
      }
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
    teacher.coursesAssigned.map(course => {
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
        status: getCourse.status
      },
      courseLog: courseLog,
      courseDescription: courseDescription,
      courseMonitoring: courseMonitoring,
      assignments: assignments,
      papers: papers,
      quizzes: quizzes
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

    courses.map(course => {
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
        session: course.session
      });
    });

    res.status(200).json({
      message: 'Courses fetched!',
      courses: updatedCourses,
      totalCourses: totalCourses
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
  const session = req.body.session;
  const errors = [];
  try {
    // if (
    //   !validator.isAlphanumeric(validator.blacklist(sections, ' ,')) ||
    //   validator.isEmpty(sections)
    // ) {
    //   errors.push('Invalid sections!');
    // }
    // if (
    //   !validator.isAlphanumeric(validator.blacklist(session, ' -')) ||
    //   validator.isEmpty(session)
    // ) {
    //   errors.push('Invalid session!');
    // }
    // if (errors.length > 0) {
    //   var error = new Error(errors);
    //   error.status = 400;
    //   throw error;
    // }
    const course = await Teacher.find({
      _id: teacherId,
      'coursesAssigned.courseId': courseId,
      'coursesAssigned.session': session
    });

    if (course.length > 0) {
      const error = new Error('Course already exists!');
      error.status = 400;
      throw error;
    }

    const courseLog = new CourseLog({
      courseId: courseId,
      teacherId: teacherId
    });
    const courseMonitoring = new CourseMonitoring({
      courseId: courseId,
      teacherId: teacherId
    });
    const courseDescription = new CourseDescription({
      courseId: courseId,
      teacherId: teacherId
    });

    const courseLogDoc = await courseLog.save();
    const courseDescriptionDoc = await courseDescription.save();
    const courseMonitoringDoc = await courseMonitoring.save();

    const assignment = new Assignment({
      courseId: courseId,
      teacherId: teacherId
    });
    const quiz = new Quiz({
      courseId: courseId,
      teacherId: teacherId
    });
    const paper = new Paper({
      courseId: courseId,
      teacherId: teacherId
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
      papers: paperDoc._id
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

    const courseIndex = teacher.coursesAssigned.findIndex(ci => {
      return ci._id.toString() === courseId.toString();
    });

    var getCourse;
    teacher.coursesAssigned.map(course => {
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
      updatedTeacher: updatedTeacher
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

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    var getCourse = courseArray[courseIndex];

    getCourse.status = 'Inactive';
    courseArray[courseIndex] = getCourse;
    teacher.coursesAssigned = courseArray;

    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Course disabled!',
      updatedTeacher: updatedTeacher
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
        $pull: { coursesAssigned: { _id: courseId } }
      }
      // { new: true }
    );
    if (!teacher) {
      const error = new Error('Error in removing course from the teacher!');
      error.code = 404;
      throw new error();
    }

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
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
      teacher: teacher
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

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error();
    }

    const courseLog = await CourseLog.findById(course.courseLog);

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw error();
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
    if (
      !validator.isAlphanumeric(validator.blacklist(topics, ' ')) ||
      validator.isEmpty(topics)
    ) {
      errors.push('Invalid topics!');
    }
    if (
      !validator.isAlphanumeric(validator.blacklist(instruments, ' ')) ||
      validator.isEmpty(instruments)
    ) {
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
      throw error();
    }

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw error();
    }

    courseLog.log.push({
      date: date,
      duration: duration,
      topics: topics,
      instruments: instruments
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

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error();
    }

    const courseMonitor = await CourseMonitoring.findById(
      course.courseMonitoring
    );

    if (!courseMonitor) {
      const error = new Error('Error in fetching course monitoring!');
      error.code = 404;
      throw error();
    }

    console.log(courseMonitor.data.howFar);

    res.status(200).json({
      message: 'Course Monitoring fetched!',
      courseMonitoring: courseMonitor
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseMonitoring = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const howFar = req.body.howFar;
  const fullCover = req.body.fullCover;
  const relevantProblems = req.body.relevantProblems;
  const assessStandard = req.body.assessStandard;
  const emergeApplication = req.body.emergeApplication;
  try {
    const courseMonitoring = await CourseMonitoring.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    courseMonitoring.data.howFar = howFar;
    courseMonitoring.data.fullCover = fullCover;
    courseMonitoring.data.relevantProblems = relevantProblems;
    courseMonitoring.data.assessStandard = assessStandard;
    courseMonitoring.data.emergeApplication = emergeApplication;

    const courseMonitoringDoc = await courseMonitoring.save();

    res.send({ courseMonitoring: courseMonitoringDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addCourseDescription = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const prerequisites = req.body.prerequisites;
  const assignments = req.body.assignments; //
  const quizzes = req.body.quizzes; //
  const mid = req.body.mid; //
  const final = req.body.final; //
  const courseCoordinator = req.body.courseCoordinator;
  const url = req.body.url;
  const currentCatalogue = req.body.currentCatalogue;
  const textBook = req.body.textBook;
  const referenceMaterial = req.body.referenceMaterial;
  const courseGoals = req.body.courseGoals;
  const topicsCovered = req.body.topicsCovered;
  const labProjects = req.body.labProjects;
  const progAssignments = req.body.progAssignments;
  const theory = req.body.theory; //
  const problemAnalysis = req.body.problemAnalysis; //
  const solutionDesign = req.body.solutionDesign; //
  const socialAndEthicalIssues = req.body.socialAndEthicalIssues; //
  const oralAndWritten = req.body.oralAndWritten;

  try {
    const courseDescription = await CourseDescription.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    courseDescription.data.prerequisites = prerequisites;
    courseDescription.data.assessmentInstruments.assignments = assignments;
    courseDescription.data.assessmentInstruments.quizzes = quizzes;
    courseDescription.data.assessmentInstruments.mid = mid;
    courseDescription.data.assessmentInstruments.final = final;
    courseDescription.data.courseCoordinator = courseCoordinator;
    courseDescription.data.url = url;
    courseDescription.data.currentCatalogue = currentCatalogue;
    courseDescription.data.textBook = textBook;
    courseDescription.data.referenceMaterial.push(referenceMaterial);
    courseDescription.data.courseGoals = courseGoals;
    courseDescription.data.topicsCovered = topicsCovered;
    courseDescription.data.labProjects = labProjects;
    courseDescription.data.progAssignments = progAssignments;
    courseDescription.data.classTimeSpent.theory = theory;
    courseDescription.data.classTimeSpent.problemAnalysis = problemAnalysis;
    courseDescription.data.classTimeSpent.solutionDesign = solutionDesign;
    courseDescription.data.classTimeSpent.socialAndEthicalIssues = socialAndEthicalIssues;
    courseDescription.data.oralAndWritten = oralAndWritten;

    const courseDescriptionDoc = await courseDescription.save();

    res.send({ CourseDescription: courseDescriptionDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== Materials ==================================================

exports.getAssignments = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error();
    }

    const assignments = await Assignment.findById(course.assignments);

    if (!assignments) {
      const error = new Error('Error in fetching course assignments!');
      error.code = 404;
      throw error();
    }

    res.status(200).json({
      message: 'Course Assignments fetched!',
      assignments: assignments
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
  const grade = req.body.grade;
  const assessment = req.body.prePost;
  var assignmentPath = req.files['assignment'][0].path;
  const assignmentFileName = req.files['assignment'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (
      !validator.isAlphanumeric(validator.blacklist(title, ' ')) ||
      validator.isEmpty(title)
    ) {
      errors.push('Invalid title!');
    }
    if (
      !validator.isNumeric(String(grade)) ||
      validator.isEmpty(String(grade))
    ) {
      errors.push('Invalid grades!');
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
      throw error();
    }

    assignment.assignments.push({
      title: title,
      grade: grade,
      assessment: assessment,
      assignment: { name: assignmentFileName, path: assignmentPath },
      solution: { name: solutionFileName, path: solutionPath }
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

exports.getQuizzes = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error();
    }

    const quizzes = await Quiz.findById(course.quizzes);

    if (!quizzes) {
      const error = new Error('Error in fetching course quizzes!');
      error.code = 404;
      throw error();
    }

    res.status(200).json({
      message: 'Course quizzes fetched!',
      quizzes: quizzes
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
  const grade = req.body.grade;
  const assessment = req.body.prePost;
  var quizPath = req.files['quiz'][0].path;
  const quizFileName = req.files['quiz'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (
      !validator.isAlphanumeric(validator.blacklist(title, ' ')) ||
      validator.isEmpty(title)
    ) {
      errors.push('Invalid title!');
    }
    if (
      !validator.isNumeric(String(grade)) ||
      validator.isEmpty(String(grade))
    ) {
      errors.push('Invalid grades!');
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
      throw error();
    }

    quiz.quizzes.push({
      title: title,
      grade: grade,
      assessment: assessment,
      quiz: { name: quizFileName, path: quizPath },
      solution: { name: solutionFileName, path: solutionPath }
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

exports.getPapers = async (req, res, next) => {
  const teacherId = req.userId;
  const courseId = req.params.courseId;

  try {
    const teacher = await Teacher.findById(teacherId);

    const courseIndex = teacher.coursesAssigned.findIndex(c => {
      return c._id.toString() === courseId.toString();
    });

    const course = teacher.coursesAssigned[courseIndex];

    if (!course) {
      const error = new Error('Error in fetching course!');
      error.code = 404;
      throw error();
    }

    const papers = await Paper.findById(course.papers);

    if (!papers) {
      const error = new Error('Error in fetching course papers!');
      error.code = 404;
      throw error();
    }

    res.status(200).json({
      message: 'Course papers fetched!',
      papers: papers
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
  const quizId = req.params.quizId;

  const title = req.body.title;
  const grade = req.body.grade;
  const assessment = req.body.prePost;
  var quizPath = req.files['quiz'][0].path;
  const quizFileName = req.files['quiz'][0].originalname;
  var solutionPath = req.files['solution'][0].path;
  const solutionFileName = req.files['solution'][0].originalname;

  const errors = [];
  try {
    if (
      !validator.isAlphanumeric(validator.blacklist(title, ' ')) ||
      validator.isEmpty(title)
    ) {
      errors.push('Invalid title!');
    }
    if (
      !validator.isNumeric(String(grade)) ||
      validator.isEmpty(String(grade))
    ) {
      errors.push('Invalid grades!');
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
      throw error();
    }

    quiz.quizzes.push({
      title: title,
      grade: grade,
      assessment: assessment,
      quiz: { name: quizFileName, path: quizPath },
      solution: { name: solutionFileName, path: solutionPath }
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
