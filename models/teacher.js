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
    role: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    cvUrl: {
      type: String
    },
    dpURL: {
      type: String
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
        },
        courseLog: {
          type: Schema.Types.ObjectId,
          ref: 'Courselog'
        },
        courseMonitoring: {
          type: Schema.Types.ObjectId,
          ref: 'Courselonitoring'
        },
        courseDescription: {
          type: Schema.Types.ObjectId,
          ref: 'Coursedescription'
        },
        quizzes: {
          type: Schema.Types.ObjectId,
          ref: 'Quizzes'
        },
        assignments: {
          type: Schema.Types.ObjectId,
          ref: 'Assignments'
        },
        papers: {
          type: Schema.Types.ObjectId,
          ref: 'Papers'
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherModel);
