const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

//consts def
const { ApolloServer } = require("apollo-server");
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
  schema: makeExecutableSchema({ typeDefs, resolvers })
});

// run server
const PORT = 3000;
const HOST = "localhost";
server.listen(PORT, HOST).then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});
// app.listen(PORT, () => console.log(`server running at port ${PORT}`))
