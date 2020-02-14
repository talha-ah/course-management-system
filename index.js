const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

// Routes Imports
const loginRoute = require('./routes/login');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');

// Mongoose Debugger
mongoose.set('debug', true);

// App Intializer
const app = express();

// Multer Storage
const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'data');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

// Multer FileFilter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// JSON BodyParser
app.use(bodyParser.json());

// File Upload Handler
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

// Serving Images Statically
app.use('/data', express.static(path.join(__dirname, 'data')));

// HTTP Headers for Cross Origin Response Status
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use('/login', loginRoute);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);

// Error Handler
app.use((error, req, res, next) => {
  const message = error.message;
  const status = error.status || 500;
  res.status(status).json({ message: message, error: error });
});

// App PORT declaration
const PORT = process.env.PORT || 3000;

// Mongoose Connector
mongoose
  .connect(
    'mongodb+srv://betarid:xtHucKuf9wzRJ6An@node-5ioaz.mongodb.net/cms?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(result => {
    app.listen(PORT, () => console.log(`App listening at ${PORT}`));
  })
  .catch(err => {
    console.log('[App.Mongoose]', err);
  });
