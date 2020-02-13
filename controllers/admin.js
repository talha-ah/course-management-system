const Teacher = require('../models/teacher');
const Admin = require('../models/admin');

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

exports.deactivateTeacher = (req, res, next) => {
  const teacherId = req.params.teacherid;

  Teacher.findById(teacherId)
    .then(teacher => {
      if (!teacher) {
        const error = new Error('Error in finding the teacher!');
        error.code = 404;
        throw new error();
      }
      teacher.status = 'Deactive';
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
