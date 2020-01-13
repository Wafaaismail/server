const session = require('../session')
const { toString, map } = require('lodash')
const { GraphQLJSONObject } = require('graphql-type-json');
const uuid = require('../../helpers/uuid')
const relateTwoNodes = require('../operations/relationships')
const stringifyArgs = (args) => {
  // delete args.nodelabel
  return '{'+map(args, (d, key)=>(`${key}: ${JSON.stringify(d)}`)).join(', ')+'}'
 
}
const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    node: async (parent, args, context, info) => {

      // query for user by name (create the user manually if it doesn't already exist in your local neo4j db)
      const data = await session.run(`MATCH (u:user {name: '${args.name}'}) RETURN u`)
      // session.close()

      // access node properties
      const output = data.records.map(record => record._fields[0].properties)[0]
      console.log(output)

      return output
    }
  },
  // Mutation: buildMutationFuncs()
  Mutation: {

    createNode: async (parent, args, context, info) => {
      // prepare a string of node arguments
      console.log(args)
      // const nodeArgs = stringifyArgs({ ...args, id: uuid() })
      //  delete args.nodelabel
      // const nodeArgs = { ...args, id: uuid() }

      // console.log({ ...args.nodeArgs, id: uuid() })
      const nodeArgs =stringifyArgs( { ...args.nodeArgs, id: uuid() })
      console.log(nodeArgs)
      // create nodes
      const data = await session.run(`CREATE (a:${args.nodelabel} ${nodeArgs}) RETURN a`)
      // access and return node properties
      const nodeProps = data.records.map(record => record._fields[0].properties)[0]

      console.log(nodeProps)
      return nodeProps
    },
    relateTwoNodes:relateTwoNodes
  }

}


module.exports = resolvers
