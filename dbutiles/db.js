const neo4j = require('neo4j-driver');
const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env]

const driver = neo4j.driver(config.neo4j, neo4j.auth.basic(config.username, config.password));

// init session 
const initsession = (req, res, next) => {
    driver.session();
    next()
}

module.exports = initsession

