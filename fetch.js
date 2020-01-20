fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  } ,
  body: JSON.stringify({
    query: `query getNodes($nodelabel: String!) {
              getNodes(nodelabel: $nodelabel)}`, 
    variables :{nodelabel: "user"}
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data))


// const makeQuery = async () => {
//   await fetch('/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     } ,
//     body: JSON.stringify({
//       query: `query search($type: String!, $searchString: String!) {
//                 getNodes(type: $type, searchString: $searchString)}`, 
//       variables: {type: "city", searchString: "ca"}
//     })
//   })
//     .then(r => r.json())
//     .then(data => {
//       console.log('data returned:', data) 
//       return data
//     })
// }
