const session = require("../session");
const { toString, map } = require("lodash");
const { GraphQLJSONObject } = require("graphql-type-json");
const uuid = require("../../helpers/uuid");
const relateTwoNodes = require("../operations/relationships");
const stringifyArgs = args => {
  // delete args.nodelabel
  return (
    "{" + map(args, (d, key) => `${key}: ${JSON.stringify(d)}`).join(", ") + "}"
  );
};
const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    node: async (parent, args, context, info) => {
      // query for user by name (create the user manually if it doesn't already exist in your local neo4j db)
      const data = await session.run(`MATCH (u:${args.nodelabel}  ) RETURN u`);
      // session.close()

      // access node properties
      const output = data.records.map(record => record._fields[0].properties);
      console.log(output);

      return output;
    }
  },
  // Mutation: buildMutationFuncs()
  Mutation: {
    createNode: async (parent, args, context, info) => {
      // prepare a string of node arguments
      console.log(args);
      const nodeArgs = stringifyArgs({ ...args.nodeArgs, id: uuid() });
      console.log(nodeArgs);
      // create nodes
      const data = await session.run(
        `CREATE (a:${args.nodelabel} ${nodeArgs}) RETURN a`
      );
      // access and return node properties
      const nodeProps = data.records.map(
        record => record._fields[0].properties
      )[0];

      console.log(nodeProps);
      return nodeProps;
    },
    // updateNode:async (parent, args, context, info) => {
    //   console.log(args)
    //   const nodeArgs =stringifyArgs( { ...args.nodeArgs })
    //   console.log(nodeArgs)
    //   const data = await session.run(`MATCH (a {id: ${JSON.stringify(args.nodeId)}}) SET a.${args.updateProp}=${JSON.stringify(args.newValue)} RETURN a`)
    updateNode: async (parent, args, context, info) => {
      console.log(args);
      const nodeArgs = stringifyArgs({ ...args.nodeArgs });
      console.log(nodeArgs);
      const data = await session.run(
        `MATCH (a {id: ${JSON.stringify(args.nodeId)}}) SET a += ${nodeArgs} `
      );
    },
    deleteNode: async (parent, args, context, info) => {
      const nodeArgs = stringifyArgs({ ...args.nodeArgs });
      const data = await session.run(
        `MATCH (a {id: ${JSON.stringify(args.nodeId)}}) DETACH DELETE a`
      );
    },

    relateTwoNodes: relateTwoNodes
  }
};

module.exports = resolvers;
