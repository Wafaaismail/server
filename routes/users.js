const router = require("express-promise-router")();
const passport = require("passport");
const { validateBody, schemas } = require("../helpers/routeshelper");
const UsersController = require("../controllers/users");

const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

router
  .route("/signup")
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSchema),
    passportSignIn,
    UsersController.signIn
  );

router.route("/authorized").get(passportJWT, UsersController.authorized);

module.exports = router;
