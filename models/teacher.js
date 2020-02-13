const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherModel = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    code: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course'
        },
        sections: {
          type: String
        },
        session: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherModel);
