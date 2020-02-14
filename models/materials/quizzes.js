const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizzes = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
});

module.exports = mongoose.model('Quizzes', quizzes);
