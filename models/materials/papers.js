const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const papers = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
});

module.exports = mongoose.model('Papers', papers);
