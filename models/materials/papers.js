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
      questionFilePath: { type: String },
      solutionFilePath: { type: String },
      weightage: { type: String },
      time: { type: String }
    }
  ]
});

module.exports = mongoose.model('Papers', papers);
