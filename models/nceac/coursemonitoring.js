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
    howFar: { type: String, default: '' },
    fullCover: { type: String, default: '' },
    relevantProblems: { type: String, default: '' },
    assessStandard: { type: String, default: '' },
    emergeApplication: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Coursemonitoring', courseMonitoring);
