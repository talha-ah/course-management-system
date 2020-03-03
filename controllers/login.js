const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const Teacher = require('../models/teacher');

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const admin = await Admin.findOne({ email: email });

    // Admin Search
    if (admin) {
      const passwordCheck = await bcrypt.compare(password, admin.password);
      if (!passwordCheck) {
        var error = new Error('Wrong password!');
        error.status = 401;
        throw error;
      }

      const token = await jwt.sign(
        { userId: admin._id, email: admin.email, isAdmin: true },
        'isthissecretkeysecured',
        { expiresIn: '3600000' }
      );
      res.status(200).json({
        message: 'Logged In Successfully!',
        userId: admin._id,
        token: token + ' ' + 'yes'
      });
    }
    // Teacher Search
    else {
      const teacher = await Teacher.findOne({ email: email });

      if (!teacher) {
        var error = new Error('Could not find anyone with this email!');
        error.status = 401;
        throw error;
      }
      const passwordCheck = await bcrypt.compare(password, teacher.password);
      if (!passwordCheck) {
        var error = new Error('Wrong password!');
        error.status = 401;
        throw error;
      }
      const token = await jwt.sign(
        { userId: teacher._id, email: teacher.email, isAdmin: false },
        'isthissecretkeysecured',
        { expiresIn: '3600000' }
      );
      res.status(200).json({
        message: 'Logged In Successfully!',
        userId: teacher._id,
        token: token + ' ' + 'no'
      });
    }
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
