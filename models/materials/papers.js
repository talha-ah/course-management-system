const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const papers = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  papers: [
    {
      title: { type: String },
      grade: { type: String },
      assessment: { type: String },
      paper: {
        name: { type: String },
        path: { type: String }
      },
      solution: {
        name: { type: String },
        path: { type: String }
      }
    }
  ]
});

module.exports = mongoose.model('Papers', papers);
