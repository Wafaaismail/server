const session = require('../session')

const relateTwoNodes = async (node1ID, node2ID, relType, biDirectional) => {
  const data = await session.run(`
    MATCH (node1 {id: ${node1ID}})
    MATCH (node2 {id: ${node2ID}})
    CREATE (node1)-[rel:${relType.toUpperCase()}]-${biDirectional ? '' : '>'}(node2)
    RETURN rel
  `)
  console.log('Related two nodes')
  const relProps = data.records.map(record => record._fields[0].properties)
  console.log(relProps)
}

// NOTE: add this manually in neo4j for testing: CREATE (:person {id: 1}), (:person {id: 2})
relateTwoNodes(1, 2, 'loves', false)
// run this file (node relationships.js) , then go check the relationship

module.exports = relateTwoNodes
