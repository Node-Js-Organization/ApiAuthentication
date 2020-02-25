const passport = require('passport'),
  JWTStrategy = require('passport-jwt').Strategy,
  { ExtractJwt } = require('passport-jwt'),
  LocalStrategy = require('passport-local').Strategy,
  GooglePlusTokenStrategy = require('passport-google-plus-token');

const db = require('./models');

//JSON WEB TOKENS STRATEGY
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
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

//GOOGLE OAUTH STRATEGY
passport.use(
    'googleToken',
    new GooglePlusTokenStrategy(
        {
            clientID: '109793887357-q18s32dgokpe6vf3alfs4i70n5bfhpgt.apps.googleusercontent.com',
            clientSecret: 'E-ul8jrKT5wsOi7Rw5hVux0q'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //check if user exist in our DB
                const existingUser = await db.User.findOne({ 'google.id': profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }

                //if new  account
                const newUser = new db.User({
                    method: 'google',
                    google: {
                        id: profile.id,
                        email: profile.emails[0].value
                    }
                });

                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, false, error.message);
            }
        }
    )
);

//LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        //find the user with the given email
        const user = await db.User.findOne({ 'local.email': email });

        //if not, handle it
        if (!user) {
          return done(null, false);
        }

        //check if password is correct
        const isMatch = await user.isValidPassword(password);

        //if not, handle it
        if (!isMatch) {
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
