const express = require('express')
const { ApolloServer } = require('apollo-server')
const typeDefs = require('./db_utils/schema/type_defs')
const resolvers = require('./db_utils/schema/resolvers')

const app = express()

// initialize apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers
})
// const makeAugmentedSchema = require('neo4j-graphql-js')
// const schema = makeAugmentedSchema({ typeDefs })
// const server = new ApolloServer({ schema, context: { driver } })

// run server
const PORT = 3000
const HOST = 'localhost'
server.listen(PORT, HOST).then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`)
})
// app.listen(PORT, () => console.log(`server running at port ${PORT}`))
