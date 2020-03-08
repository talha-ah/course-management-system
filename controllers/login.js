const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail');

const Teacher = require('../models/teacher');

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
    teacher.role.forEach(rol => {
      if (rol === 'Admin') {
        isAdmin = true;
      }
    });
    const token = await jwt.sign(
      { userId: teacher._id, email: teacher.email, lol: isAdmin },
      'isthissecretkeysecure',
      { expiresIn: '3600000' }
    );
    const tokenAppend = isAdmin ? 'yes' : 'no';
    res.status(200).json({
      message: 'Logged In Successfully!',
      userId: teacher._id,
      token: token + ' ' + tokenAppend
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
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };
  //ES8
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.toString());
  }
};
