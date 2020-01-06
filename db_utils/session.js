const neo4j = require('neo4j-driver')

// get neo4j configurations
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

// initialize driver connection
const neo4jAuth = neo4j.auth.basic(config.username, config.password)
const driver = neo4j.driver(config.neo4j_url, neo4jAuth)

// create and export database session
const dbSession = driver.session()
module.exports = dbSession
