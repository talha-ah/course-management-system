const ClassModel = require('../models/class');

exports.makeClass = async (req, res, next) => {
  const section = req.body.section;
  const batch = req.body.batch;

  try {
    const Newclass = new ClassModel({
      section: section,
      batch: batch,
    });

    const savedClass = await Newclass.save();
    res.status(200).json({ message: 'Class created', class: savedClass });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.addStudent = async (req, res, next) => {
  const batch = req.body.batch;
  const section = req.body.section;
  const fullName = req.body.fullName;
  const rollNumber = req.body.rollNumber;

  try {
    const fetchClass = await ClassModel.findOne({
      batch: batch,
      section: section,
    });

    if (!fetchClass) {
      const error = new Error('Whoops, could not find the class.');
      error.status = 404;
      throw error;
    }

    var found = false;
    fetchClass.students.map((student) => {
      if (student.rollNumber === rollNumber) {
        found = true;
      }
    });

    if (found) {
      const error = new Error('Whoops, student already exists.');
      error.status = 404;
      throw error;
    }

    fetchClass.students.push({
      fullName: fullName,
      rollNumber: rollNumber,
    });

    const savedClass = await fetchClass.save();
    res.status(201).json({ message: 'Student created', class: savedClass });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getClass = async (req, res, next) => {
  const batch = req.params.batch;
  const section = req.params.section;
  const fullBatch = batch + '-' + (+batch + 4);
  try {
    const fetchClass = await ClassModel.findOne({
      batch: fullBatch,
      section: section,
    });

    if (!fetchClass) {
      const error = new Error('Whoops, could not find the class.');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Class fetched!', class: fetchClass });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};
