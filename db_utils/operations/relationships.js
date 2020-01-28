const neo4j = require("neo4j-driver");

// get neo4j configurations
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config")[env];

// initialize driver connection
const neo4jAuth = neo4j.auth.basic(config.username, config.password);
const driver = neo4j.driver(config.neo4j_url, neo4jAuth);
const uuid = require('../../helpers/uuid')
const relateTwoNodes = async (parent, args, context, info) => {
  const session = driver.session();
  console.log("1", args.node1ID);
  console.log("2", args.node2ID);
  await session
    .writeTransaction(tx =>
      tx.run(`
    MATCH (node1 {id: ${JSON.stringify(args.node1ID)}})
    MATCH (node2 {id: ${JSON.stringify(args.node2ID)}})
    CREATE (node1)-[rel:${args.relType} {id: "${uuid()}"}]-${
        args.biDirectional ? "" : ">"
      }(node2)
    RETURN rel
  `)
    )
    .then(result => {
      if (result) {
        // biDirectional doesn't work (get back to it)
        const relProps = result.records.map(
          record => record._fields[0].properties
        )[0];
        console.log(relProps);
        return relProps;
      }
    });
};

// NOTE: add this manually in neo4j for testing: CREATE (:person {id: 1}), (:person {id: 2})
// relateTwoNodes(1, 'loves', 2)
// run this file (node relationships.js) , then go check the relationship

module.exports = relateTwoNodes;
