const express = require('express');

const router = express.Router();

const Admin = require('../models/admin');
const Teacher = require('../models/teacher');

router.post('/', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  res.send(`google, ${email}, ${password} ggoe`);

  //   const authenticated = false;

  //   // Admin
  //   Admin.find({ email: email })
  //     .then(user => {
  //       if (!user) {
  //         return;
  //       }
  //       if (user.password !== password) {
  //         return;
  //       }
  //       authenticated = true;
  //     })
  //     .catch(err => {
  //       console.log('[Admin.Login]', err);
  //     });
  //   // Teacher
  //   if (!authenticated) {
  //     Teacher.find({ email: email })
  //       .then(user => {
  //         if (!user) {
  //           return;
  //         }
  //         if (user.password !== password) {
  //           return;
  //         }
  //         authenticated = true;
  //       })
  //       .catch(err => {
  //         console.log('[Teacher.Login]', err);
  //       });
  //   }
  //   if (authenticated) {
  //     // Authenticate
  //   } else {
  //     var error = new Error('Something wrong with your credentials!');
  //     error.code = 400;
  //     throw error;
  //   }
});

module.exports = router;
