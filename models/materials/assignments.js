const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assignments = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  assignments: [
    {
      questionFilePath: { type: String },
      solutionFilePath: { type: String },
      weightage: { type: String },
      time: { type: String }
    }
  ]
});

module.exports = mongoose.model('Assignments', assignments);
