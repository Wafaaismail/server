const session = require("../session");
const { toString, map, cloneDeep } = require("lodash");
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

      // destructure search settings
      let {
        searchNode, matchByExactProps, matchByPartialProp,
        relative1, relative2, searchReturn
      } = args.settings
      // console.log(searchNode, matchByExactProps, matchByPartialProp, relative1, relative2, searchReturn)
      
      // automatically add relation variables if needed
      returnWords = searchReturn.split(',').length
      if (returnWords === 2) searchReturn += ', rel1'
      if (returnWords === 3) searchReturn += ', rel1, rel2'

      // my amazing query
      const QUERY = `
        // match the node itself and see if it is a matchByExactProps
        match (self:${searchNode} ${matchByExactProps ? stringifyArgs(matchByExactProps) : ''})
        
        // see if it is a matchByPartialProp (case-insensitive)
        ${matchByPartialProp ?
          `where self.${Object.keys(matchByPartialProp)[0]} =~ '(?i).*${Object.values(matchByPartialProp)[0]}.*'` : ''}
        
        // check relatives (maximum of 2) and create pattern if any
        match
        ${relative1 ? `(relative1:${relative1})-[rel1]-` : ''} 
        (self) 
        ${relative2 ? `-[rel2]-(relative2:${relative2})` : ''}
        
        return ${searchReturn}
      `


      // run query
      const data = await session.run(QUERY)
      
      // prepare storage for data
      const output = {
        [`${searchNode}_data`]: {}
      }
      if (relative1) {
        output[`${relative1}_data`] = {}
        output['relations_data'] = {}
      }
      if (relative2) output[`${relative2}_data`] = {}
      // console.log(output)

      // extract and allocate data in storage
      data.records.map((record) => {
        // console.log(record)
        map(record._fieldLookup, (fieldIndex, field) => {
          // get the object (node/relation)
          const obj = record._fields[fieldIndex]
          console.log(obj)
          switch (field) {
            case 'self': 
            case 'relative1': 
            case 'relative2':
              // I used indexing here to override repeated data (query issue)
              output[`${obj.labels[0]}_data`][obj.properties.id] = { ...obj.properties }
              break
            
            case 'rel1':
            case 'rel2':
              // I used indexing here to override repeated data (query issue)
              output['relations_data'][obj.properties.id] = { 
                ...obj.properties, 
                type: obj.type,
                [`${searchNode}Id`]: record._fields[record._fieldLookup.self].properties.id,
                [field == 'rel1' ? `${relative1}Id` : `${relative2}Id`]: record._fields[record._fieldLookup[field == 'rel1' ? 'relative1' : 'relative2']].properties.id
              }
              break
          }
        })

      })
      // console.log(output)

      return output
    },

    // search: async (parent, args, context, info) => {
    //   let data
    //   switch (args.type) {
    //     case 'station':
    //       data = await session.run(
    //         `match (city:city) where city.name contains  toLower("${args.searchString}")
    //          match (city)-[rel1:EXISTS_IN]->(country:country)
    //          match (city)<-[rel2:EXISTS_IN]-(station:station)
    //          return country, city, station`
    //       )
    //       break
    //     case 'city':
    //       data = await session.run(
    //         `match (city:city) where city.name contains  toLower("${args.searchString}")
    //         match (city) -[rel:EXISTS_IN]->(country:country)
    //         return country, city`
    //       )
    //       break
    //     default:
    //       console.log(`error Searching for  ${args.type}`)
    //   }

    //   // access node properties

    //   const output = data.records.map(record => {
    //     const recordData = {}
    //     record._fields.map(node => {
    //       recordData[node.labels[0]] = {
    //         name: node.properties.name,
    //         id: node.properties.id
    //       }
    //     })
    //     return recordData
    //   }
    //   )
    //   console.log(output)
    //   return output;
    // }
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
