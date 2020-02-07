const express = require('express');
const mongoose = require('mongoose');

const app = express();

const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');

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
