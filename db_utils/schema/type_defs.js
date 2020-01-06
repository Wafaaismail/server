const { gql } = require('apollo-server')

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
`

module.exports = typeDefs
