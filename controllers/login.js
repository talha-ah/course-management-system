const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const sgMail = require('@sendgrid/mail');

const Teacher = require('../models/teacher');

exports.signUp = async (req, res, next) => {
  const email = req.body.email;
  const teacherCode = req.body.code;
  const rank = req.body.rank;
  const teacherType = req.body.type;

  const password = 'DefaultPassword';
  const role = ['Admin', 'Teacher'];
  const status = 'Pending';
  const dpURL = 'undefined';
  const cvUrl = 'undefined';

  const errors = [];
  try {
    if (!validator.isEmail(email)) {
      errors.push('Invalid email!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(teacherCode, ' '))) {
      errors.push('Invalid code!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(rank, ' '))) {
      errors.push('Invalid rank!');
    }
    if (!validator.isAlpha(validator.blacklist(teacherType, ' '))) {
      errors.push('Invalid type!');
    }
    if (errors.length > 0) {
      var error = new Error(errors);
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new Teacher({
      email: teacherEmail,
      password: hashedPassword,
      teacherCode: teacherCode,
      status: status,
      rank: rank,
      type: teacherType,
      dpURL: dpURL,
      cvUrl: cvUrl,
      role: role,
    });

    const savedAdmin = await admin.save();
    if (!savedAdmin) {
      const err = new Error('User creation failed!');
      err.code = 404;
      throw err;
    }
    res.status(200).json({ message: 'User Created!', admin: savedAdmin });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const teacher = await Teacher.findOne({ email: email });

    if (!teacher) {
      var error = new Error('No user found with this email!');
      error.status = 404;
      throw error;
    }
    const passwordCheck = await bcrypt.compare(password, teacher.password);
    if (!passwordCheck) {
      var error = new Error('Wrong password!');
      error.status = 403;
      throw error;
    }
    var isAdmin = false;
    teacher.role.forEach((rol) => {
      if (rol === 'Admin') {
        isAdmin = true;
      }
    });
    const token = await jwt.sign(
      { userId: teacher._id, email: teacher.email, lol: isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '3600000' }
    );
    const tokenAppend = isAdmin ? 'yes' : 'no';
    res.status(200).json({
      message: 'Logged In Successfully!',
      userId: teacher._id,
      token: token + ' ' + tokenAppend,
    });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  const email = req.body.email;
  api_key =
    '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';

  console.log(email);

  sgMail.setApiKey(api_key);
  const msg = {
    to: email,
    from: 'test@example.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  //ES8
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.toString());
  }
};
