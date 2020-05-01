const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); // logger
const helmet = require('helmet'); // headers

// Routes Imports
const loginRoute = require('./routes/login');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const classRoutes = require('./routes/class');

// App Intializer
const app = express();

// Debuggers
mongoose.set('debug', true);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

app.use(
  process.env.PORT
    ? morgan('combined', { stream: accessLogStream })
    : morgan('dev')
);

app.use(cors());
app.use(helmet());

// JSON BodyParser
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true })); // x-www-form-urlencoded <form>

// Serving Images Statically
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes
app.use('/login', loginRoute);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/class', classRoutes);

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
    `mongodb+srv://${process.env.MONGO_URI_USERNAME}:${process.env.MONGO_URI_PASSWORD}@node-5ioaz.mongodb.net/${process.env.MONGO_URI_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then((result) => {
    app.listen(PORT, () => console.log(`App listening at ${PORT}`));
  })
  .catch((err) => {
    console.log('[App.Mongoose]', err);
  });
