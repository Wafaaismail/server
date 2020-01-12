const { gql } = require('apollo-server')
const typeDefs = gql`

scalar JSONObject

  type Query{
      node: JSONObject!
  }
  type Mutation{

    createNode( nodelabel :String , nodeArgs :JSONObject) :JSONObject
    updateNode(nodeId: String,nodeArgs:JSONObject):String
    deleteNode(nodeId:String):Boolean



    relateTwoNodes(node1ID :String, node2ID :String, relType:String, biDirectional:Boolean) :JSONObject 
  }
`

module.exports = typeDefs
