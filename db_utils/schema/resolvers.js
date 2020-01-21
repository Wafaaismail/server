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

    getNodes: async (parent, args, context, info) => {
      const data = await session.readTransaction(tx =>
        tx.run(`match (node:${args.nodelabel} ${stringifyArgs(args.nodeArgs)}) return node`)
      ).then(result => {
        if (result) {
          console.log('result', result)
          return result.records.map(record => console.log(record._fields[0].properties));
        }
      })

    },

    normalizedSearch: async (parent, args, context, info) => {
      const nodeLabel = args.nodelabel
      const settings = args.settings
      // search is always partial and case-insensitive
      data = await session.run(
        `
          match (self:${nodeLabel}) 
          where self.${settings.relative ? `id` : settings.searchProp} =~ '(?i).*${settings.searchInput}.*'
          ${settings.relative ? `match (self)-[]-(relative:${settings.relative.nodelabel}) return relative`
          : 'return self'}
        `
      )
      return data.records.map(record => (record._fields[0].properties))
    },
    search: async (parent, args, context, info) => {
      let data
      switch (args.type) {
        case 'station':
          data = await session.run(
            `match (city:city) where city.name contains  toLower("${args.searchString}")
             match (city)-[rel1:EXISTS_IN]->(country:country)
             match (city)<-[rel2:EXISTS_IN]-(station:station)
             return country, city, station`
          )
          break
        case 'city':
          data = await session.run(
            `match (city:city) where city.name contains  toLower("${args.searchString}")
            match (city) -[rel:EXISTS_IN]->(country:country)
            return country, city`
          )
          break
        default:
          console.log(`error Searching for  ${args.type}`)
      }

      // access node properties

      const output = data.records.map(record => {
        const recordData = {}
        record._fields.map(node => {
          recordData[node.labels[0]] = {
            name: node.properties.name,
            id: node.properties.id
          }
        })
        return recordData
      }
      )
      console.log(output)
      return output;
    }
  },
  // Mutation: buildMutationFuncs()
  Mutation: {
    createNode: async (parent, args, context, info) => {
      // prepare a string of node arguments
      const nodeArgs = stringifyArgs({ ...args.nodeArgs });
      // create nodes
      const data = await session.run(
        `CREATE (a:${args.nodelabel} ${nodeArgs}) RETURN a`
      );
      // access and return node properties
      const nodeProps = data.records.map(
        record => record._fields[0].properties
      )[0];

      return nodeProps;
    },
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
