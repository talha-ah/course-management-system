const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseMonitoring = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  data: {
    howFar: { type: String },
    fullCover: { type: String },
    relevantProblems: { type: String },
    assessStandard: { type: String },
    emergeApplication: { type: String }
  }
});

module.exports = mongoose.model('Coursemonitoring', courseMonitoring);
