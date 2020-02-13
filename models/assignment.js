const mongoose = require('mongoose');

const Scheme = mongoose.Schema;

const assignmentModel = new Scheme(
  {
    title: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentModel);
