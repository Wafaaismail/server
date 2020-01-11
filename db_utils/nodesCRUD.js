const { map, upperFirst, cloneDeep, get } = require('lodash')
const session = require('./session')
const uuid = require('../helpers/uuid')

// create a list with node names
const nodeNames = [
  'user', 'journey', 'trip', 
  'payment', 'passenger', 'station', 
  'city', 'country', 'vehicle'
]

const stringifyArgs = (args) => {
  let stringifiedArgs = '{'
  map(args, (value, key) => {
    const prop = `${key}: '${value}',`
    stringifiedArgs += prop
  })
  // remove last comma
  stringifiedArgs = stringifiedArgs.slice(0, -1)
  stringifiedArgs += '}'
  return stringifiedArgs
}

const createNode = (nodeName) => {  
  return async (parent, args, context, info) => {  
    // prepare a string of node arguments
    const nodeArgs = stringifyArgs({ ...args, id: uuid() })
    // create node
    const data = await session.run(`CREATE (a:${nodeName} ${nodeArgs}) RETURN a`)
    // access and return node properties
    const nodeProps = data.records.map(record => record._fields[0].properties)[0]
    console.log(nodeProps)
    return nodeProps
  }
}

const buildMutationFuncs = () => {
  const myFuncs = {}
  map(nodeNames, (nodeName) => {
    myFuncs[`create${upperFirst(nodeName)}`] = createNode(nodeName)
  })
  return myFuncs
}

console.log(buildMutationFuncs())

module.exports = buildMutationFuncs
