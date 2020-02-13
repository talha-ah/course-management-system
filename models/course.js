const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const course = new Scheme(
  {
    title: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseModel);
