const router = require('express').Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { TOKEN_SECRET } = require('../secrets/index')
const Jokes = require('../jokes/jokes-data')
const { checkCredentialsExist, checkUsernamePassword } = require('../middleware/restricted')

router.post('/register', checkCredentialsExist, checkUsernamePassword, async (req, res, next) => {
  res.json(await Jokes.insert(req.body))
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 const { username, password } = req.body
 const hash = bcrypt.hashSync(password, 8)
 username.add({ username, password: hash })
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(next)
});

router.post('/login', checkUsernamePassword, checkCredentialsExist, async (req, res, next) => {
  res.json(await Jokes.insert(req.body))
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
      if (bcrypt.compareSync(req.body.password, req.user.password)) {
        const token = buildToken(req.user)
        res.json({
          message: `${req.user.username} is back!`,
          token,
        })
      } else {
        next({ status: 401, message: 'Invalid credentials'})
      }
});

function buildToken(users) {
  const payload = {
    subject: users.user_id,
    username: users.username,
    password: users.password,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, TOKEN_SECRET, options)
}

module.exports = router;
