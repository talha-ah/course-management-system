const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const courseDescription = new Scheme(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
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
    courses: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CourseDescription', courseDescription);
