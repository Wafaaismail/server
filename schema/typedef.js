const {gql} = require('apollo-server')

const session = require('../dbutiles/db')

const typeDefs = gql`
    type User {
        name : String 
        password :String
        email : String
    }
    type Journey {
        start_dt: String
        end_dt :String
        duration: String

    }

    type Trip {
        start_dt: String
        end_dt : String
        duration: String
    }
    type Passport_data{
        name : String
        birth_date :String
        passport_no: String
        expiration_date: String
        
    }
    type Passenger{
        name:String 
        passport_data : Passport_data
    }

    type Station {
        name: String
        code :String
    }

    type City {
        name: String
    }

    type Country{
        name: String
    }
    type Vechile{
        type: String
        code :String
    }
    type Payment{
        type:String
        card_no: String
        Status: Boolean
    }
    type Query{
        user: User!
    }
    type Mutation  {
        createUser(name:String, password :String ,email:String):User!
    }
`;
const resolvers = {
    Query :{
        user :(parent,args,context,info)=>{
            console.log(session.run('MATCH (user:user {name  :"amr"})' ))
            return session.run('MATCH (user:user {name  :"amr"})')
        }
    },
    Mutation :{
        createUser: async (parent,args,context,info) =>{
            const data = await session.run(`CREATE (user:user {name:${args.name}, password :${args.password}, email:${args.email}})`)
            return data.records[0]._fields[0].properties 
        }
    }
}
module.exports = {typeDefs,resolvers}