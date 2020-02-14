const Teacher = require('../models/teacher');
const CourseLog = require('../models/nceac/courselog');
const CourseMonitoring = require('../models/nceac/coursemonitoring');
const CourseDescription = require('../models/nceac/coursedescription');

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
      courseMonitoring: courseMonitoringDoc._id
    });
    const teacherData = await teacher.save();

    if (!teacherData) {
      const error = new Error('Error in saving the teacher!');
      error.code = 404;
      throw new error();
    }
    res.send({ teacher: teacherData });
  } catch (err) {
    console.log('[takeCourse.Teacher]', err);
  }
};

exports.removeCourse = (req, res, next) => {
  const courseName = req.body.name;
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

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
      console.log('[removeCourse.Teacher]', err);
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
    const courseLog = await CourseLog.findOne({ courseId: courseId });

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
    console.log('[addCourseLog.Teacher]', err);
  }
};

exports.addCourseMonitoring = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;
};

exports.addCourseDescription = async (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;
};

// =========================================================== Materials ==================================================

exports.addQuiz = (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in fetching the teacher!');
        error.code = 404;
        throw new error();
      }
    })
    .catch(err => {
      console.log('[removeCourse.Teacher]', err);
    });
};

exports.addPaper = (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in fetching the teacher!');
        error.code = 404;
        throw new error();
      }
    })
    .catch(err => {
      console.log('[removeCourse.Teacher]', err);
    });
};

exports.addAssignment = (req, res, next) => {
  const courseId = req.body.courseId;
  const teacherId = req.body.teacherId;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in fetching the teacher!');
        error.code = 404;
        throw new error();
      }
    })
    .catch(err => {
      console.log('[removeCourse.Teacher]', err);
    });
};

// gender: {type: String, enum: ["Male", "Female"]}
