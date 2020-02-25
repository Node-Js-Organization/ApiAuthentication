const router = require('express-promise-router')(),
  passport = require('passport'),
  passportConf = require('../passport');

//helpers
const {
  validateBody,
  schemas: { authSchema }
} = require('../helpers/routeHelpers');

//controllers
const UsersController = require('../controllers/users');

//passport authenticate strategy
const authenticate = (strategy) =>
  passport.authenticate(`${strategy}`, { session: false });

router.route('/signup').post(validateBody(authSchema), UsersController.signup);

router
  .route('/signin')
  .post(
    validateBody(authSchema),
    authenticate('local'),
    UsersController.signin
  );

router.route('/oauth/google')
  .post(
    authenticate('googleToken'),
    UsersController.googleOAuth
  );

router.route('/secret').get(authenticate('jwt'), UsersController.secret);

module.exports = router;
