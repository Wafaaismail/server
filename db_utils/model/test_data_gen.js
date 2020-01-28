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
  cypherQuery += `  (country_${index + 1}:country { name: '${country}' , id: '${uuid()}' }), \n`
})
// add cities
cities.forEach((city, index) => {
  cypherQuery += `  (city_${index + 1}:city { name: '${city}' , id: '${uuid()}'}), \n`
})
// add 3 stations for each city
cities.forEach((city, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (station_${maxIndex - 2}:station { name: '${city} station1' , id: '${uuid()}'}), \n`
  cypherQuery += `  (station_${maxIndex - 1}:station { name: '${city} station2' , id: '${uuid()}'}), \n`
  cypherQuery += `  (station_${maxIndex}:station { name: '${city} station3' , id: '${uuid()}'}), \n`
})
// add 3 passengers for each user
users.forEach((user, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (passenger_${maxIndex - 2}:passenger { name: '${user} passenger1', id: '${uuid()}' }), \n`
  cypherQuery += `  (passenger_${maxIndex - 1}:passenger { name: '${user} passenger2', id: '${uuid()}' }), \n`
  cypherQuery += `  (passenger_${maxIndex}:passenger { name: '${user} passenger3', id: '${uuid()}' }), \n`
})

/* ------ RELATIONSHIPS ------ */
// add relationships between countries and cities
countries.forEach((county, index) => {
  const maxIndex = (index + 1) * 2
  cypherQuery += `  (city_${maxIndex - 1}) -[:EXISTS_IN {id: '${uuid()}'}]-> (country_${index + 1}), \n`
  cypherQuery += `  (city_${maxIndex}) -[:EXISTS_IN {id: '${uuid()}'}]-> (country_${index + 1}), \n`
})
// add relationships between cities and stations
cities.forEach((city, index) => {
  const maxIndex = (index + 1) * 3
  cypherQuery += `  (station_${maxIndex - 2}) -[:EXISTS_IN {id: '${uuid()}'}]-> (city_${index + 1}), \n`
  cypherQuery += `  (station_${maxIndex - 1}) -[:EXISTS_IN {id: '${uuid()}'}]-> (city_${index + 1}), \n`
  cypherQuery += `  (station_${maxIndex}) -[:EXISTS_IN {id: '${uuid()}'}]-> (city_${index + 1}), \n`
})


cypherQuery = cypherQuery.slice(0, -3) // delete from the end until last comma

// journey1 test data
// WITH is needed between the create above and the match below
cypherQuery += `
\n WITH true as pass \n
match (s1:station {name: "cairo station1"})
match (s2:station {name: "roma station1"})
match (s3:station {name: "liverpool station1"})
match (s4:station {name: "california station1"})
create 
(j:journey {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})-[:HAS {id: "${uuid()}"}]->(t1:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v1:vehicle {type: "flight", id:"${uuid()}"}),
(j)-[:HAS {id: "${uuid()}"}]->(t2:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v2:vehicle {type: "flight", id:"${uuid()}"}),
(j)-[:HAS {id: "${uuid()}"}]->(t3:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v3:vehicle {type: "flight", id:"${uuid()}"}),
(t1)-[:FROM {id: "${uuid()}"}]->(s1),
(t1)-[:TO {id: "${uuid()}"}]->(s2),
(t2)-[:FROM {id: "${uuid()}"}]->(s2),
(t2)-[:TO {id: "${uuid()}"}]->(s3),
(t3)-[:FROM {id: "${uuid()}"}]->(s3),
(t3)-[:TO {id: "${uuid()}"}]->(s4)
`


// journey2 test data
// WITH is needed between the create above and the match below
cypherQuery += `
\n WITH true as pass \n
match (s5:station {name: "cairo station1"})
match (s6:station {name: "roma station2"})
match (s7:station {name: "liverpool station2"})
match (s8:station {name: "california station2"})
create 
(j2:journey {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})-[:HAS {id: "${uuid()}"}]->(t4:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v4:vehicle {type: "flight", id:"${uuid()}"}),
(j2)-[:HAS {id: "${uuid()}"}]->(t5:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v5:vehicle {type: "flight", id:"${uuid()}"}),
(j2)-[:HAS {id: "${uuid()}"}]->(t6:trip {start_d:"2020-01-27 15:15", end_d:"2020-01-28 15:15", id:"${uuid()}"})<-[:MAKES {id: "${uuid()}"}]-(v6:vehicle {type: "flight", id:"${uuid()}"}),
(t4)-[:FROM {id: "${uuid()}"}]->(s5),
(t4)-[:TO {id: "${uuid()}"}]->(s6),
(t5)-[:FROM {id: "${uuid()}"}]->(s6),
(t5)-[:TO {id: "${uuid()}"}]->(s7),
(t6)-[:FROM {id: "${uuid()}"}]->(s7),
(t6)-[:TO {id: "${uuid()}"}]->(s8)
`

console.log(cypherQuery)

fs.writeFile('test_data.txt', cypherQuery, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('Cypher query was written to test_data.txt')
})
