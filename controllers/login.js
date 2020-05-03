const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const Teacher = require('../models/teacher');

exports.signUp = async (req, res, next) => {
  const teacherEmail = req.body.email;
  const teacherCode = req.body.code;
  const teacherRank = req.body.rank;

  const teacherType = 'Admin';
  const role = ['Admin', 'Teacher'];
  const password = 'password';
  const status = 'Pending';
  const dpURL = 'undefined';
  const cvUrl = 'undefined';

  const errors = [];
  try {
    if (!validator.isEmail(teacherEmail)) {
      errors.push('Invalid teacher email!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(teacherCode, ' '))) {
      errors.push('Invalid code!');
    }
    if (!validator.isAlphanumeric(validator.blacklist(teacherRank, ' '))) {
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

    const savedAdmin = await teacher.save();
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
    if (teacher.status === 'Inactive') {
      var error = new Error(
        'Your account is not active! Please contact Admin.'
      );
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
      user: {
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        status: teacher.status,
        type: teacher.type,
      },
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

  try {
    const teacher = await Teacher.findOne({ email: email });

    if (!teacher) {
      var error = new Error('No user found with this email!');
      error.status = 404;
      throw error;
    }
    if (teacher.status === 'Inactive') {
      var error = new Error(
        'Your account is not active! Please contact Admin.'
      );
      error.status = 403;
      throw error;
    }

    var length = 12,
      charset =
        '#&|!@abcdefghijklmnopqrstuvwxyz#&|!@ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#&|!@',
      resetPass = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      resetPass += charset.charAt(Math.floor(Math.random() * n));
    }

    const hashedPassword = await bcrypt.hash(resetPass, 12);

    teacher.password = hashedPassword;

    // Email Starts
    const filePath = path.join(__dirname, '../utils/resetPassword.html');
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      name: teacher.firstName + ' ' + teacher.lastName,
      email: email,
      password: resetPass,
      action_url: 'https://condescending-davinci.netlify.app/',
    };
    const htmlToSend = template(replacements);
    var transporter = nodemailer.createTransport({
      // host: 'smtp.mailtrap.io',
      // port: 2525,
      // auth: {
      //   user: 'b33edd77e38c85',
      //   pass: '4f6a254bdb395e',
      // },
      service: 'gmail',
      auth: {
        user: 'ariaylake@gmail.com',
        pass: 'shutdown12',
      },
    });
    const mailOptions = {
      from: 'ariaylake@gmail.com',
      to: 'betarid65@gmail.com',
      subject: 'CMS-Password Reset Request',
      // text: url,
      html: htmlToSend,
    };

    await transporter.sendMail(mailOptions);
    await teacher.save();
    res.status(200).json({ message: 'Email sent!' });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
