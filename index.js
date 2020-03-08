const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Routes Imports
const loginRoute = require('./routes/login');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');

// App Intializer
const app = express();

// Debuggers
mongoose.set('debug', true);
app.use(logger('dev'));

// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// // setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors());

// JSON BodyParser
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>

// Serving Images Statically
app.use(express.static(path.join(__dirname, 'data')));

// Routes
app.use('/login', loginRoute);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);

// Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  const message = error.message;
  const status = error.status || 500;
  res.status(status).json({ message: message, error: error });
});

// App PORT declaration
const PORT = process.env.PORT || 8080;

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
