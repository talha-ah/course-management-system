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
  data: {
    prerequisites: { type: String },
    assessmentInstruments: {
      assignments: { type: String },
      quizzes: { type: String },
      mid: { type: String },
      final: { type: String }
    },
    courseCoordinator: { type: String },
    url: { type: String },
    currentCatalogue: { type: String },
    textBook: { type: String },
    referenceMaterial: [{ type: String }],
    courseGoals: { type: String },
    topicsCovered: { type: String },
    labProjects: { type: String },
    progAssignments: { type: String },
    classTimeSpent: {
      theory: { type: String },
      problemAnalysis: { type: String },
      solutionDesign: { type: String },
      socialAndEthicalIssues: { type: String }
    },
    oralAndWritten: { type: String }
  }
});

module.exports = mongoose.model('Coursedescription', courseDescription);
