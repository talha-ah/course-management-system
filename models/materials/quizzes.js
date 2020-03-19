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
      title: { type: String },
      grade: { type: String },
      assessment: { type: String },
      quiz: {
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

module.exports = mongoose.model('Quizzes', quizzes);
