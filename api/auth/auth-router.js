const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secrets");
const User = require("./users-model");
const { restart } = require("nodemon")

const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json("Username and password required!");
  } else {
    next();
  }
};

const checkForUsername = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json("Username taken");
    }
  } catch (err) {
    res.status(500).json(`Server error: ${err.message}`);
  }
};

checkUserExists = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json("Invalid credentials");
    }
  } catch (err) {
    res.status(401).json(`Server error: ${err.message}`);
  }
};

router.post("/register", checkPayload, checkForUsername, async (req, res) => {
  // let user = req.body;

  // const rounds = process.env.BCRYPT_ROUNDS || 8;
  // const hash = bcrypt.hashSync(user.password, rounds);

  // user.password = hash;
  // Users.add(user)
  //   .then((saved) => {
  //     res.status(201).json({ message: `Welcome, ${saved.username}` });
  //   })
  //   .catch(next);
  try {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = await User.add({
      username: req.body.username,
      password: hash,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(`Server error: ${err.message}`);
  }

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
});

router.post("/login", checkPayload, checkUserExists, (req, res) => {
  try {
    const verified = bcrypt.compareSync(
      req.body.password,
      req.userData.password
    );
    if (verified) {
      req.session.user = req.userData.json(`Welcome ${req.userData.username}`);
    } else {
      res.status(401).json("Invalid credentials");
    }
  } catch (err) {
    res.status(500).json(`Server error: ${err.message}`);
  }

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
});

module.exports = router;
