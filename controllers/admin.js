const bcrypt = require('bcryptjs');
const validator = require('validator');

const Teacher = require('../models/teacher');
const Course = require('../models/course');
const Assignment = require('../models/materials/assignments');
const Quiz = require('../models/materials/quizzes');
const Paper = require('../models/materials/papers');

const Class = require('../models/class');

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
  const adminId = req.userId;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  try {
    const admin = await Teacher.findById(adminId);
    if (!admin) {
      const error = new Error('User could not be found!');
      error.status = 400;
      throw error;
    }

    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.email = email;
    const updatedAdmin = await admin.save();

    if (!updatedAdmin) {
      const error = new Error('User could not be saved!');
      error.status = 400;
      throw error;
    }

    res.status(201).json({ message: 'Profile updated!', user: updatedAdmin });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.editAdminPassword = async (req, res, next) => {
  const teacherId = req.userId;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const errors = [];
  try {
    if (
      !validator.isLength(newPassword, { min: 6 }) ||
      validator.isEmpty(newPassword)
    ) {
      errors.push('New Password should be more than 6 characters!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error('Could not find user.');
      err.status = 404;
      throw err;
    }

    const passwordCheck = await bcrypt.compare(
      currentPassword,
      teacher.password
    );
    if (!passwordCheck) {
      var error = new Error('Wrong current password!');
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
      },
    });
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
    teachers.map((teacher) => totalteachers++);

    res.status(200).json({
      message: 'Teachers fetched!',
      teachers: teachers,
      totalTeachers: totalteachers,
    });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getTeacher = async (req, res, next) => {
  const teacherId = req.params.teacherId;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const error = new Error(
        'Whoops, there was an error in finding the teacher!'
      );
      error.code = 404;
      throw error;
    }

    res.status(201).json({ message: 'Teacher fetched!', teacher: teacher });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createTeacher = async (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const teacherRank = req.body.rank;
  const teacherType = req.body.type;

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
    if (validator.isEmpty(teacherCode)) {
      errors.push('Invalid code!');
    }
    if (validator.isEmpty(teacherRank)) {
      errors.push('Invalid teacher rank!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(teacherType, ' '))) {
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
      rank: teacherRank,
      type: teacherType,
      dpURL: dpURL,
      cvUrl: cvUrl,
      role: role,
    });

    const savedTeacher = await teacher.save();
    if (!savedTeacher) {
      const err = new Error('User creation failed!');
      err.code = 404;
      throw err;
    }
    res.status(200).json({ message: 'User Created!', teacher: savedTeacher });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateTeacher = async (req, res, next) => {
  const teacherId = req.params.teacherId;

  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const teacherRank = req.body.rank;
  const teacherType = req.body.type;
  const errors = [];

  try {
    if (!validator.isEmail(teacherEmail)) {
      errors.push('Invalid teacher email!');
    }
    if (validator.isEmpty(teacherCode)) {
      errors.push('Invalid code!');
    }
    if (validator.isEmpty(teacherRank)) {
      errors.push('Invalid teacher rank!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(teacherType, ' '))) {
      errors.push('Invalid teacher type!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const err = new Error(
        'Whoops, there was a problem in finding the teacher!'
      );
      err.code = 404;
      throw err;
    }

    teacher.email = teacherEmail;
    teacher.teacherCode = teacherCode;
    teacher.rank = teacherRank;
    teacher.type = teacherType;

    const updatedTeacher = await teacher.save();
    if (!updatedTeacher) {
      const err = new Error(
        'Whoops, there was a problem in saving the teacher!'
      );
      err.code = 404;
      throw err;
    }
    res
      .status(201)
      .json({ message: 'Teacher updated!', teacher: updatedTeacher });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deactivateTeacher = async (req, res, next) => {
  const teacherId = req.params.teacherId;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const error = new Error('Error in finding the user!');
      error.code = 404;
      throw error;
    }
    teacher.status = 'Inactive';
    const updatedTeacher = await teacher.save();
    if (!updatedTeacher) {
      const error = new Error('Error in saving the user!');
      error.code = 404;
      throw error;
    }
    res
      .status(201)
      .json({ message: 'Teacher deactivated!', user: updatedTeacher });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.enableTeacher = async (req, res, next) => {
  const teacherId = req.params.teacherId;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const error = new Error(
        'Whoops, there was an error in finding the user!'
      );
      error.code = 404;
      throw error;
    }
    teacher.status = 'Active';
    const updatedTeacher = await teacher.save();
    if (!updatedTeacher) {
      const error = new Error(
        'Whoops, there was an error in saving the teacher!'
      );
      throw error;
    }
    res.status(201).json({ message: 'Teacher enabled!', user: updatedTeacher });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.resetTeacherPassword = async (req, res, next) => {
  const teacherId = req.params.teacherId;

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      const error = new Error(
        'Whoops, there was an error in finding the teacher!'
      );
      error.code = 404;
      throw error;
    }
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 12);

    teacher.password = hashedPassword;
    const updatedTeacher = await teacher.save();

    res.status(201).json({
      message: 'Teacher password reset completed!',
      teacher: updatedTeacher,
    });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
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
    courses.map((course) => totalCourses++);

    res.status(200).json({
      message: 'Courses fetched!',
      courses: courses,
      totalCourses: totalCourses,
    });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      var error = new Error('Whoops, there was a problem finding that course!');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Course fetched!', course: course });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const courseCredits = req.body.credits;
  const courseType = req.body.type;
  const courseSession = req.body.session;
  const status = 'Active';
  const errors = [];

  try {
    if (!validator.isAlphanumeric(validator.blacklist(courseTitle, ' '))) {
      errors.push('Invalid course title!');
    }
    if (validator.isEmpty(courseCode)) {
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
      code: courseCode,
      session: courseSession,
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
      status: status,
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
  const courseId = req.params.courseId;

  const courseTitle = req.body.title;
  const courseCode = req.body.code;
  const courseCredits = req.body.credits;
  const courseType = req.body.type;
  const courseSession = req.body.session;
  const errors = [];

  try {
    if (!validator.isAlphanumeric(validator.blacklist(courseTitle, ' '))) {
      errors.push('Invalid course title!');
    }
    if (validator.isEmpty(courseCode)) {
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
      const err = new Error('Whoops, course fetching failed!');
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
      throw error;
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
    .then((course) => {
      if (!course) {
        const error = new Error('Error in deleting the course!');
        error.code = 404;
        throw error;
      }
      res.send({ course: course });
    })
    .catch((err) => {
      if (!err.status) {
        err.status = 500;
      }
      next(err);
    });
};

// ================================================ Generate Report =================================================

exports.generateReport = async (req, res, next) => {
  const teacherId = req.params.teacherId;
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
      const error = new Error('Error in fetching paper doc!');
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
    if (quizCount === 0) {
      const error = new Error(
        `${teacher.firstName} ${teacher.lastName} have not added any quiz for this course yet.`
      );
      error.code = 404;
      throw error;
    }
    if (
      !quizDoc.grades[section.toString()] ||
      Object.keys(quizDoc.grades[section.toString()]).length !== quizCount
    ) {
      const error = new Error('Quiz grading required.');
      error.code = 404;
      throw error;
    }
    var assignmentCount = 0;
    assignmentDoc.assignments.map((assignment) => {
      if (assignment.section.toString() === section.toString()) {
        assignmentCount++;
      }
    });
    if (assignmentCount === 0) {
      const error = new Error(
        `${teacher.firstName} ${teacher.lastName} have not added any assignment for this course yet.`
      );
      error.code = 404;
      throw error;
    }
    if (
      !assignmentDoc.grades[section.toString()] ||
      Object.keys(assignmentDoc.grades[section.toString()]).length !==
        assignmentCount
    ) {
      const error = new Error('Assignment grading required.');
      error.code = 404;
      throw error;
    }
    var midPaper = false;
    var finalPaper = false;
    paperDoc.papers.map((paper) => {
      if (paper.section.toString() === section.toString()) {
        if (paper.assessment === 'Mid-Term') midPaper = true;
        if (paper.assessment === 'Final-Term') finalPaper = true;
      }
    });
    if (midPaper && finalPaper) {
      const error = new Error(
        `${teacher.firstName} ${teacher.lastName} have not added any paper for this course yet.`
      );
      error.code = 404;
      throw error;
    }
    var totalQuizGrade = 0;
    quizDoc.quizzes.map((quiz) => {
      if (quiz.section.toString() === section.toString()) {
        if (quiz.resultAdded) {
          var grade;
          Object.entries(quizDoc.grades[section.toString()]).map((ele) => {
            if (quiz._id.toString() === ele[0].toString()) {
              grade = ele[1];
            }
          });
          totalQuizGrade += +grade;
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
    var totalAssignmentGrade = 0;
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
          totalAssignmentGrade += +grade;
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
          Math.round(
            (+data.quiz[student.rollNumber] +
              +data.assignment[student.rollNumber] +
              Number.EPSILON) *
              10
          ) / 10,
        finalExam: data.finalTerm[student.rollNumber],
        totalMarks:
          Math.round(
            (+data.quiz[student.rollNumber] +
              +data.assignment[student.rollNumber] +
              +data.midTerm[student.rollNumber] +
              +data.finalTerm[student.rollNumber] +
              Number.EPSILON) *
              10
          ) / 10,
      });
    });
    res
      .status(200)
      .json({
        info: info,
        data: data2,
        assignmentGrade: totalAssignmentGrade,
        quizGrade: totalQuizGrade,
      });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
