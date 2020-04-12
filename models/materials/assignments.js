const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assignments = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
  },
  assignments: [
    {
      title: { type: String },
      grade: { type: String },
      batch: '',
      section: '',
      assessment: { type: String },
      assignment: {
        name: { type: String },
        path: { type: String },
      },
      solution: {
        name: { type: String },
        path: { type: String },
      },
      result: { type: Object },
    },
  ],
});

module.exports = mongoose.model('Assignments', assignments);
