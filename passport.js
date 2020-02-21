const passport = require('passport'),
      JWTStrategy = require('passport-jwt').Strategy,
      { ExtractJwt } = require('passport-jwt'),
      LocalStrategy = require('passport-local').Strategy;

const db = require('./models');

//JSON WEB TOKENS STRATEGY
passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET
        },
        async (payload, done) => {
            try {
                //find the user specified in token
                const user = await db.User.findById(payload.sub);

                //if user doesn't exist, handle it
                if (!user) {
                    return done(null, false);
                }

                //otherwise, return the user
                done(null, user);
            } catch (err) {
                done(err, false);
            }
        }
    )
);

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    //find the user with the given email
    const user = await db.User.findOne({email});

    //if not, handle it
    if(!user) {
        return done(null, false);
    }

    //check if password is correct


    //if not, handle it

    //otherwise, return the user
}));

