const neo4j = require('neo4j-driver');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]


const driver = neo4j.driver(config.neo4j, neo4j.auth.basic(config.username, config.password));

const session = driver.session();


//example on creating node on neo4j replaced in get/post later 
// const resultPromise = session.run(
//   `CREATE (user:user {name: 'amr'})-[:BOOKED]->(J:journey)`,
  
// );


module.exports = session

