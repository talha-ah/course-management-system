const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizzes = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  quizzes: [
    {
      questionFilePath: { type: String },
      solutionFilePath: { type: String },
      weightage: { type: String },
      time: { type: String }
    }
  ]
});

module.exports = mongoose.model('Quizzes', quizzes);
