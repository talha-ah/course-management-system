const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseLog = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  log: [
    {
      date: { type: String },
      duration: { type: String },
      topics: { type: String },
      instruments: { type: String }
    }
  ]
});

module.exports = mongoose.model('Courselog', courseLog);
