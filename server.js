
// packages
const express = require('express')
const {ApolloServer} = require('apollo-server')

// folders
const driver = require('./dbutiles/db')
const  {typeDefs,resolvers} = require('./schema/typedef')
//consts def
const app = express()
const PORT = 3000

// const makeAugmentedSchema = require('neo4j-graphql-js')
// const schema = makeAugmentedSchema({ typeDefs })
// const server = new ApolloServer({ schema, context: { driver } });
const server = new ApolloServer({
    typeDefs,
    resolvers
})

//Routes
// app.use('/users', require('./routes/users'))


server.listen(PORT, '0.0.0.0').then(({ url }) => {
    console.log(`GraphQL API ready at ${url}`);
  });
  

//run server
// app.listen(PORT, () => console.log(`server running at port ${PORT}`))