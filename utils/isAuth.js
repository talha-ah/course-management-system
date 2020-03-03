const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  var header = req.get('Authorization');

  if (!header) {
    const error = new Error('Authorization header not found!');
    error.status = 400;
    next(error);
  }

  var token = header.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'isthissecretkeysecured');
  } catch (error) {
    if (!error.status) {
      error.status = 500;
      next(error);
    }
  }

  if (!decodedToken) {
    const error = new Error('Authorization token not validated!');
    error.status = 401;
    next(error);
  }

  req.userId = decodedToken.userId.toString();
  req.email = decodedToken.email;
  req.isAdmin = decodedToken.isAdmin;

  next();
};
