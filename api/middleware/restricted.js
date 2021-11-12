// module.exports = (req, res, next) => {
//   next();
//   /*
//     IMPLEMENT

//     1- On valid token in the Authorization header, call next.

//     2- On missing token in the Authorization header,
//       the response body should include a string exactly as follows: "token required".

//     3- On invalid or expired token in the Authorization header,
//       the response body should include a string exactly as follows: "token invalid".
//   */
// };
const { JWT_SECRET } = require('../secrets/index')
const jwt = require('jsonwebtoken')
const { findBy } = require('../auth/model')

const restricted = (req, res, next) => {

  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: 'Token require'})
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'Token invalid'})
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}

const checkUsernamePassword = (req, res, next) => {
  
  if (!req.body.username || !req.body.password) {
    next({ status: 422, message: 'username and password required'})
  } else {
    next()
  }
}

const checkCredentialsExist = async (req, res, next) => {
  
  try {
    const [user] = await findBy({ username: req.body.username, password: req.body.password })
    if (!user) {
      next({ status: 422, message: 'Invalid credentials'})
    } else {
      req.user = user 
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  restricted,
  checkUsernamePassword,
  checkCredentialsExist,
}