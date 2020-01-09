const session = require('../session')
const { toString, map } = require('lodash')
const buildMutationFuncs = require('../nodesCRUD')

const prepareArgs = (args) => {
  let stringifiedArgs = "{"
  map(args, (value, key) => {
    const prop = `${key}: '${value}',`
    stringifiedArgs += prop
  })
  stringifiedArgs = stringifiedArgs.slice(0, -1)
  stringifiedArgs += "}"
  console.log(stringifiedArgs)
  return stringifiedArgs
}

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {

      // query for user 'amr' (create the user manually if it doesn't already exist in your local neo4j db)
      const data = await session.run('MATCH (user:user {name  :"amr"}) RETURN user')
      // session.close()

      // access node properties
      const output = data.records[0]._fields[0].properties
      // const output = data.records.map(record => record._fields[0].properties)[0]
      console.log(output)

      return output
    }
  },
  Mutation: buildMutationFuncs()
}

module.exports = resolvers
