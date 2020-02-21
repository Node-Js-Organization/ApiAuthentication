const db = require('../models');

class UserController {
    static async signup(req, res, next) {
        const {value: {body: {email, password}}} = req;

        //check if there is a user with the same email
        const foundUser = await db.User.findOne({email});

        if(foundUser) {
            return res.status(403).json({error: 'Email is already in use'});
        }

        //create a new user
        const newUser = db.User.create({email, password});
        await newUser.save();

        //respond with token
        res.json({user: 'created'});
    }

    static signin(req, res, next) {
        // Generate token
        console.log('sign in called')
    }

    static secret(req, res, next) {
        console.log('secret called')
    }
}

module.exports = UserController;