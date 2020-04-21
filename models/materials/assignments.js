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
  grades: { type: Object, default: {} },
  assignments: [
    {
      title: { type: String },
      marks: { type: String },
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
      resultAdded: { type: Boolean, default: false },
      result: { type: Object, default: {} },
    },
  ],
});

module.exports = mongoose.model('Assignments', assignments);
