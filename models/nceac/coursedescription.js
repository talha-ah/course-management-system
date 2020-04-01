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
  status: { type: String, default: 'new', required: true },
  data: {
    prerequisites: { type: String, default: '' },
    assessment: {
      assignments: { type: String, default: '' },
      quizzes: { type: String, default: '' },
      mid: { type: String, default: '' },
      final: { type: String, default: '' }
    },
    coordinator: { type: String, default: '' },
    url: { type: String, default: '' },
    catalog: { type: String, default: '' },
    textbook: { type: String, default: '' },
    reference: { type: String, default: '' },
    goals: { type: String, default: '' },
    topicsCovered: { type: String, default: '' },
    laboratory: { type: String, default: '' },
    programming: { type: String, default: '' },
    classTime: {
      theory: { type: String, default: '' },
      problemAnalysis: { type: String, default: '' },
      solutionDesign: { type: String, default: '' },
      socialAndEthicalIssues: { type: String, default: '' }
    },
    oralWritten: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Coursedescription', courseDescription);
