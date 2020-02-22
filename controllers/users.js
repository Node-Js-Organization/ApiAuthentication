const JWT = require('jsonwebtoken'),
  db = require('../models');

const signToken = (user) => {
  return JWT.sign(
    {
      iss: 'AdamMorsi',
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};

class UserController {
  static async signup(req, res, next) {
    const {
      value: {
        body: { email, password }
      }
    } = req;

    //check if there is a user with the same email
    const foundUser = await db.User.findOne({ email });

    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    //create a new user
    const newUser = new db.User({ email, password });
    await newUser.save();

    //create token
    const token = signToken(newUser);

    //respond with token
    res.status(200).json({ token });
  }

  static signin(req, res, next) {
    const { user } = req;
    // Generate token
    const token = signToken(user);
    res.status(200).json({ token });
  }

  static secret(req, res, next) {
    res.json({ secret: 'resource' });
  }
}

module.exports = UserController;
