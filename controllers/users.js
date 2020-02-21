const JWT = require('jsonwebtoken'),
      db = require('../models');

class UserController {
    static async signup(req, res, next) {
        const { value: { body: { email, password } } } = req;

        //check if there is a user with the same email
        const foundUser = await db.User.findOne({ email });

        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }

        //create a new user
        const newUser = new db.User({ email, password });
        await newUser.save();

        //create token
        const token = JWT.sign({
            iss: 'AdamMorsi',
            sub: newUser._id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 1),
        }, process.env.ACCESS_TOKEN_SECRET);

        //respond with token
        res.status(200).json({token});
    }

    static signin(req, res, next) {
        // Generate token
        console.log('sign in called');
    }

    static secret(req, res, next) {
        console.log('secret called');
    }
}

module.exports = UserController;