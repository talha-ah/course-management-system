const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  batch: { type: String, required: true },
  section: { type: String, required: true },
  students: [
    {
      fullName: { type: String, required: true },
      rollNumber: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Class', ClassSchema);
