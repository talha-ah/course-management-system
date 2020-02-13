const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const teacherModel = new Scheme(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    code: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    courses: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherModel);
