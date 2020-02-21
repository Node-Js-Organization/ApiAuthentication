const passport = require('passport'),
      JWTStrategy = require('passport-jwt').Strategy,
      { ExtractJwt } = require('passport-jwt');

const db = require('./models');

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