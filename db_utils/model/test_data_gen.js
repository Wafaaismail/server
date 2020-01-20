// to empty neo4j database: MATCH (n) DETACH DELETE n

const fs = require('fs')
const uuid = require('../../helpers/uuid')
let cypherQuery = 'CREATE\n'

const users = ['amr', 'khaled', 'alaa', 'wafaa', 'amal', 'esraa']
const countries = ['egypt', 'UK', 'italy', 'USA']
const cities = ['cairo', 'alex', 'liverpool', 'manchester', 'roma', 'milan', 'california', 'los angeles']

/* ------ NODES ------ */
// add users
users.forEach((user, index) => {
  cypherQuery += `  (user_${index + 1}:user { name: '${user}', password: 'alohomora_${user}', email: '${user}@mail.com' }), \n`
})
// add countries
countries.forEach((country, index) => {
  cypherQuery += `  (country_${index + 1}:country { name: '${country}' , id:${JSON.stringify(uuid())} }), \n`
})
// add cities
cities.forEach((city, index) => {
  cypherQuery += `  (city_${index + 1}:city { name: '${city}' , id:${JSON.stringify(uuid())}}), \n`
})
// add 3 stations for each city
cities.forEach((city, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (station_${maxIndex - 2}:station { name: '${city} station1' }), \n`
  cypherQuery += `  (station_${maxIndex - 1}:station { name: '${city} station2' }), \n`
  cypherQuery += `  (station_${maxIndex}:station { name: '${city} station3' }), \n`
})
// add 3 passengers for each user
users.forEach((user, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (passenger_${maxIndex - 2}:passenger { name: '${user} passenger1' }), \n`
  cypherQuery += `  (passenger_${maxIndex - 1}:passenger { name: '${user} passenger2' }), \n`
  cypherQuery += `  (passenger_${maxIndex}:passenger { name: '${user} passenger3' }), \n`
})

/* ------ RELATIONSHIPS ------ */
// add relationships between countries and cities
countries.forEach((county, index) => {
  const maxIndex = (index + 1) * 2
  cypherQuery += `  (city_${maxIndex - 1}) -[:EXISTS_IN]-> (country_${index + 1}), \n`
  cypherQuery += `  (city_${maxIndex}) -[:EXISTS_IN]-> (country_${index + 1}), \n`
})
// add relationships between cities and stations
cities.forEach((city, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (station_${maxIndex - 2}) -[:EXISTS_IN]-> (city_${index + 1}), \n`
  cypherQuery += `  (station_${maxIndex - 1}) -[:EXISTS_IN]-> (city_${index + 1}), \n`
  cypherQuery += `  (station_${maxIndex}) -[:EXISTS_IN]-> (city_${index + 1}), \n`
})

cypherQuery += ' DELETE THIS LINE AND THE LAST COMMA ABOVE YASTA'

console.log(cypherQuery)

// ` CREATE
//   ('user':user { name: "", password: "", email: "" }) ,
//   ('payment':payment { type: "", card_no: "", status: "" }) ,
//   ('journey':journey { start_dt: "", end_dt: "", duration:"" }) ,
//   ('passenger':passenger { name: "", passport_data: "" }) ,
//   ('trip':trip { start_dt: "", end_dt: "", duration:"" }) ,
//   ('station':station { name: "", code: "" }) ,
//   ('city':city { name: "" }) ,
//   ('country':country { name: "" }) ,
//   ('vehicle':vehicle { type: "", code: "" }) ,

//   ('user')-[:'MAKES' ]->('payment'),
//   ('payment')-[:'FOR' ]->('journey'),
//   ('user')-[:'BOOKED' ]->('journey'),
//   ('journey')-[:'FOR' ]->('passenger'),
//   ('journey')-[:'HAS' ]->('trip'),
//   ('trip')-[:'TO' ]->('station'),
//   ('station')-[:'EXISTS_IN' ]->('city'),
//   ('city')-[:'EXISTS_IN' ]->('country'),
//   ('trip')-[:'FROM' ]->('station'),
//   ('vehicle')-[:'MAKES' ]->('trip')
// `

fs.writeFile('test_data.txt', cypherQuery, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Cypher query was written to test_data.txt')
})
