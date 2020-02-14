const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseDescription = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  data: []
});

module.exports = mongoose.model('Coursedescription', courseDescription);
