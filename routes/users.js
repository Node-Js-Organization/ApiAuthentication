const router = require('express-promise-router')();

//helpers
const {validateBody, schemas} = require('../helpers/routeHelpers');

//controllers
const UsersController = require('../controllers/users');

router.route('/signup').post(validateBody(schemas.authSchema), UsersController.signup);

router.route('/signin').post(UsersController.signin);

router.route('/secret').get(UsersController.secret);

module.exports = router;