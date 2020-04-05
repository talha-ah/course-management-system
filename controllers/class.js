const ClassModel = require('../models/class');

exports.getClass = (req, res, next) => {
  console.log(req.userId);
  console.log(req.body);
};

exports.makeClass = async (req, res, next) => {
  const section = req.body.section;
  const batch = req.body.batch;

  try {
    const Newclass = new ClassModel({
      section: section,
      batch: batch
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
  const fullName = req.body.fullName;
  const rollNumber = req.body.rollNumber;
  const classId = req.body.classId;

  try {
    const fetchClass = await ClassModel.findById(classId);

    if (!fetchClass) {
      const error = new Error('Whoops, could not find the class.');
      error.status = 404;
      throw error;
    }

    fetchClass.students.push({
      fullName: fullName,
      rollNumber: rollNumber
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
  const classId = req.params.classId;

  try {
    const fetchedClass = await ClassModel.findById(classId);

    if (!fetchedClass) {
      const error = new Error('Whoops, could not find the class.');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Class fetched!', class: fetchedClass });
  } catch (err) {
    if (err.status) {
      err.status = 500;
    }
    next(err);
  }
};
