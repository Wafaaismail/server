const { gql } = require('apollo-server')
const typeDefs = gql`

scalar JSONObject

  type Query{
      node: JSONObject!
  }
  type Mutation{

    createNode( nodelabel :String , nodeArgs :JSONObject) :JSONObject



    relateTwoNodes(node1ID :String, node2ID :String, relType:String, biDirectional:Boolean) :JSONObject 
  }
`

module.exports = typeDefs
