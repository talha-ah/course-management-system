const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assignments = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
});

module.exports = mongoose.model('Assignments', assignments);
