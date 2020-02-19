const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseModel = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    credits: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseModel);
