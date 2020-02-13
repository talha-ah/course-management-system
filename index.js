const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set('debug', true);

const app = express();

const loginRoute = require('./routes/login');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');

// JSON BodyParser
app.use(bodyParser.json());

// Routes
app.use('/login', loginRoute);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);

mongoose
  .connect(
    'mongodb+srv://betarid:xtHucKuf9wzRJ6An@node-5ioaz.mongodb.net/cms?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(connection => {
    console.log('Mongoose Connected!');
    app.listen(3000);
  })
  .catch(err => {
    console.log('Mongooose Error!');
  });
