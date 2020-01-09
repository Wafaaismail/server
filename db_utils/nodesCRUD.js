const { map, upperFirst, cloneDeep, get } = require('lodash')
const session = require('./session')
// create a list with node names
const nodeNames = [
  'user', 'journey', 'trip', 
  'payment', 'passenger', 'station', 
  'city', 'country', 'vehicle'
]

const prepareArgs = (args) => {
  let stringifiedArgs = "{"
  map(args, (value, key) => {
    const prop = `${key}: '${value}',`
    stringifiedArgs += prop
  })
  stringifiedArgs = stringifiedArgs.slice(0, -1)
  stringifiedArgs += "}"
  console.log(stringifiedArgs)
  return stringifiedArgs
}

// const createNode = (app) => {  
//   return async (parent, args, context, info) => {  
//     // create node
//     const data = await session.run(`CREATE (a:${app} ${prepareArgs(args)}) RETURN a`)
//     // return node properties
//     const nodeProps = data.records[0]._fields[0].properties
//     return nodeProps
//   }
// }

const buildMutationFuncs = () => {
  const myFuncs = {}
  map(nodeNames, (nodeName) => {
    const create = async (parent, args, context, info) => {  
      // create node
      const data = await session.run(`CREATE (a:${nodeName} ${prepareArgs(args)}) RETURN a`)
      // return node properties
      const nodeProps = data.records[0]._fields[0].properties
      return nodeProps
    }
    myFuncs[`create${upperFirst(nodeName)}`] = create
    // const handlers = {
    //   [`create${upperFirst(nodeName)}`]: createNode,
    //   // [`read${upperFirst(nodeName)}`]: readNode,
    //   // [`update${upperFirst(nodeName)}`]: updateNode,
    //   // [`delete${upperFirst(nodeName)}`]: deleteNode
    // }

    // myFuncs[`${nodeName}Funcs`] = (app, ) => (
    //   get(handlers, a, state => state)(app)
    // )
  })
  return myFuncs
}

console.log(buildMutationFuncs())

module.exports = buildMutationFuncs
