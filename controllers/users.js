const JWT = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const _ = require("lodash");
const { JWT_SECRET } = require("./secretKey/index");
const User = require("./models/user");

createToken = user => {
  return JWT.sign(
    {
      sub: user.id
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    //Return error if there's a user with the same email
    const foundUser = await _.find(User, { email });
    if (foundUser) {
      return res.status(403).json({ error: "Email already exists" });
    }

    //If not, then create a new user
    const newUser = { id: uuidv4(), email, password };

    //And add it to database
    User = { ...User, [newUser.id]: newUser };

    // res.json(User)

    //Create token depending on current user id
    const token = createToken(newUser);

    //Respond with created token
    res.status.json({ token });
  },

  signIn: async (req, res, next) => {
    //Generate JWT token
    const token = createToken(req.user);
    res.status(200).json({ token });
  },

  authorized: async (req, res, next) => {
    //Redirect to authorized page
  }
};
