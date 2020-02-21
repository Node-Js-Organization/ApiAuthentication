const router = require('express-promise-router')(),
      passport = require('passport'),
      passportConf = require('../passport');

//helpers
const {validateBody, schemas} = require('../helpers/routeHelpers');

//controllers
const UsersController = require('../controllers/users');

router.route('/signup').post(validateBody(schemas.authSchema), UsersController.signup);

router.route('/signin').post(UsersController.signin);

router.route('/secret').get(passport.authenticate('jwt', {session: false}), UsersController.secret);

module.exports = router;