const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const localStrategy = require("passport-local").Strategy;
const { find } = require("lodash");
const resolvers = require("./db_utils/schema/resolvers");
const { JWT_SECRET } = require("./secretKey/index");

// JWT passport strategy
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        //find the user specified in the token
        const user = await resolvers.Query.node({}, { nodelabel: "user", nodeArgs: {id: payload.sub} }) .then(res=> res);

        //if user does not exist, handle it
        if (!user) {
          return done(null, false);
        }

        //otherwise return that user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Local passport strategy
passport.use(
  new localStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        //find the user given the email
        const user = await resolvers.Query.node({}, { nodelabel: "user", nodeArgs:{email} }) .then(res=> res);
        //if not ,handle it
        if (!user) {
          return done(null, false);
        }
        //check if the password is correct
        const isMatch = user.password == password;

        //if not ,handle it
        if (!isMatch) {
          return done(null, false);
        }
        //otherwise return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
