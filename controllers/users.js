const JWT = require("jsonwebtoken");
// const uuid = require("../helpers/uuid");
const { isEmpty } = require("lodash");
const { JWT_SECRET } = require("../secretKey/index");
// const User = require("../models/user");
const resolvers = require("../db_utils/schema/resolvers");

createToken = user => {
  return JWT.sign(
    {
      iss: "Creating Token",
      sub: user.id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 1) //current time +1 day
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { name, email, password } = req.value.body;
    // console.log("Sign up",User)
    //Return error if there's a user with the same email
    const foundUser = await resolvers.Query.node({}, { nodelabel: "user", nodeArgs:{email} }) .then(res=> res);

    if (!isEmpty(foundUser)) {
      return res.status(403).json({ error: "Email already exists" });
    }

    //If not, then create a new user
    let newUser = { name, email, password };

    //And add it to GraphDB
    // User.push(newUser);
    newUser = await resolvers.Mutation.createNode({}, { nodelabel: "user", nodeArgs: newUser }).then(res=>res);
    //Create token depending on current user id
    const token = createToken(newUser);

    //Respond with created token
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    //generate token
    const token = createToken(req.user);
    res.status(200).json({ token });
  },

  authorized: async (req, res, next) => {
    //Redirect to authorized page
    console.log("i managed to get here!");
    res.json({ secrets: "resource" });
  }
};
