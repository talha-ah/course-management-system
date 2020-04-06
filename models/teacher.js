const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teacherModel = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    teacherCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    role: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    dpURL: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
    },
    address: {
      address: { type: String },
      country: { type: String },
      city: { type: String },
      zip: { type: String },
    },
    phone: {
      type: Number,
    },
    courses: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    coursesAssigned: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
        },
        sections: [
          {
            type: Array,
          },
        ],
        session: {
          type: String,
        },
        status: {
          type: String,
        },
        courseLog: {
          type: Schema.Types.ObjectId,
          ref: 'Courselog',
        },
        courseMonitoring: {
          type: Schema.Types.ObjectId,
          ref: 'Coursemonitoring',
        },
        courseDescription: {
          type: Schema.Types.ObjectId,
          ref: 'Coursedescription',
        },
        quizzes: {
          type: Schema.Types.ObjectId,
          ref: 'Quizzes',
        },
        assignments: {
          type: Schema.Types.ObjectId,
          ref: 'Assignments',
        },
        papers: {
          type: Schema.Types.ObjectId,
          ref: 'Papers',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherModel);
