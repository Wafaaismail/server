const session = require('../session')
const { toString, map } = require('lodash')
const buildMutationFuncs = require('../operations/nodes')

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {

      // query for user by name (create the user manually if it doesn't already exist in your local neo4j db)
      const data = await session.run(`MATCH (u:user {name: '${args.name}'}) RETURN u`)
      // session.close()

      // access node properties
      const output = data.records.map(record => record._fields[0].properties)[0]
      console.log(output)

      return output
    }
  },
  Mutation: buildMutationFuncs()
}

module.exports = resolvers
