const deleteFile = require('../utils/deleteFile');

const Teacher = require('../models/teacher');
const CourseLog = require('../models/nceac/courselog');
const CourseMonitoring = require('../models/nceac/coursemonitoring');
const CourseDescription = require('../models/nceac/coursedescription');
const Assignment = require('../models/materials/assignments');
const Quizz = require('../models/materials/quizzes');
const Paper = require('../models/materials/papers');

// =========================================================== Profile ================================================

exports.editProfile = async (req, res, next) => {
  const teacherId = req.body.teacherId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const address = req.body.address;
  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      const err = new Error('Could not find teacher.');
      err.status = 422;
      throw err;
    }

    if (req.file) {
      var dpURL = req.file.path;
      dpURL = dpURL.replace(/\\/g, '/');
      if (dpURL !== teacher.dpURL) {
        deleteFile(teacher.dpURL);
        teacher.dpURL = dpURL;
      }
    }

    teacher.firstName = firstName;
    teacher.lastName = lastName;
    teacher.email = email;
    teacher.password = password;
    teacher.address = address;

    const updatedTeacher = await teacher.save();

    res.send({ message: 'Profile Updated', teacher: updatedTeacher });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(er);
  }
};

exports.editCV = async (req, res, next) => {
  const teacherId = req.body.teacherId;
  if (!req.file) {
    const err = new Error('No file provided.');
    err.status = 422;
    throw err;
  }
  const cvPath = req.file.path;
  if (!cvPath) {
    const err = new Error('File not provided.');
    err.status = 422;
    throw err;
  }
  cvPath = cvPath.replace(/\\/g, '/');

  try {
    const teacher = await Teacher.findById(teacherId);

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

    const updatedTeacher = await teacher.save();

    res.status(200).json({ message: 'CV Uploaded.', teacher: updatedTeacher });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// =========================================================== Courses ================================================

exports.takeCourse = async (req, res, next) => {
  const courseId = req.body.courseId;
  const sections = req.body.sections;
  const session = req.body.session;
  const teacherId = req.body.teacherId;

  try {
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
    const quiz = new Quizz({
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
      throw new error();
    }

    teacher.courses.push({
      courseId: courseId,
      sections: sections,
      session: session,
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
    res.send({ teacher: teacherData });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.removeCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  // delete course places

  Teacher.findByIdAndUpdate(
    teacherId,
    {
      $pull: { courses: { courseId: courseId } }
    },
    { new: true }
  )
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in removing course from the teacher!');
        error.code = 404;
        throw new error();
      }
      res.send({ teacher: teacher, courseName: courseName });
    })
    .catch(err => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

// =========================================================== NCEAC Forms ================================================

exports.addCourseLog = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const date = req.body.date;
  const duration = req.body.duration;
  const topics = req.body.topics;
  const instruments = req.body.instruments;
  try {
    const courseLog = await CourseLog.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    if (!courseLog) {
      const error = new Error('Error in fetching course log!');
      error.code = 404;
      throw new error();
    }

    courseLog.log.push({
      date: date,
      duration: duration,
      topics: topics,
      instruments: instruments
    });

    const courseLogDoc = await courseLog.save();

    res.send({ courseLog: courseLogDoc });
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

exports.addAssignment = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const assignment = await Assignment.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    assignment.assignments.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const assignmentDoc = await assignment.save();

    res.send({ assignments: assignmentDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addQuiz = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const quiz = await Quizz.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    quiz.quizzes.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const quizDoc = await quiz.save();

    res.send({ quizzes: quizDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addPaper = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  const questionFilePath = req.body.questionFilePath;
  const solutionFilePath = req.body.solutionFilePath;
  const weightage = req.body.weightage;
  const time = req.body.time;

  try {
    const paper = await Paper.findOne({
      teacherId: teacherId,
      courseId: courseId
    });

    paper.papers.push({
      questionFilePath: questionFilePath,
      solutionFilePath: solutionFilePath,
      weightage: weightage,
      time: time
    });

    const paperDoc = await paper.save();

    res.send({ papers: paperDoc });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
