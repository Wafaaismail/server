const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

//consts def
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./db_utils/schema/type_defs");
const resolvers = require("./db_utils/schema/resolvers");
const { makeExecutableSchema } = require("graphql-tools");
const app = express();

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

//Routes
app.use("/users", require("./routes/users"));

// initialize apollo server
const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  formatError: error => {
    return error;
  },
  context: ({ req, res }) => {
    return {
      req,
      res
    };
  }
});

// run server
const PORT = 3000;
server.applyMiddleware({ app, path: "/graphql" });

// const HOST = "localhost";
// server.listen(PORT, HOST).then(({ url }) => {
//   console.log(`GraphQL API ready at ${url}`);
// });
app.listen(PORT, () => console.log(`server running at port ${PORT}`));
