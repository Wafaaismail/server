const session = require('../session')

const relateTwoNodes = async (parent, args, context, info) => {
  
  console.log('1', args.node1ID);
  console.log('2', args.node2ID);
  const data = await session.writeTransaction(tx=>
    tx.run(`
    MATCH (node1 {id: ${JSON.stringify(args.node1ID)}})
    MATCH (node2 {id: ${JSON.stringify(args.node2ID)}})
    CREATE (node1)-[rel:${args.relType} {status: "created"}]-${args.biDirectional ? '' : '>'}(node2)
    RETURN rel
  `)).then(result=>{
    if(result) {

      // biDirectional doesn't work (get back to it)
      const relProps = data.records.map(record => record._fields[0].properties)[0]
      console.log(relProps)
      return relProps
    }
  
  })
}

// NOTE: add this manually in neo4j for testing: CREATE (:person {id: 1}), (:person {id: 2})
// relateTwoNodes(1, 'loves', 2)
// run this file (node relationships.js) , then go check the relationship

module.exports = relateTwoNodes
