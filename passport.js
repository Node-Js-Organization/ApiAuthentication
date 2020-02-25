const passport = require('passport'),
  JWTStrategy = require('passport-jwt').Strategy,
  { ExtractJwt } = require('passport-jwt'),
  LocalStrategy = require('passport-local').Strategy,
  GooglePlusTokenStrategy = require('passport-google-plus-token'),
  FacebookTokenStrategy = require('passport-facebook-token');

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
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
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

//FACEBOOK STRATEGY
passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //check if user exist in our DB
        const existingUser = await db.User.findOne({
          'facebook.id': profile.id
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        //if new  account
        const newUser = new db.User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
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
