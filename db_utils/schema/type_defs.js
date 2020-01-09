const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    id : String
    name : String 
    password :String
    email : String
  }
  type Journey {
    id : String
    start_dt: String
    end_dt :String
    duration: String
  }
  type Trip {
    id : String  
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
    id : String
    name:String 
    passport_data : Passport_data
  }
  type Station {
    id : String  
    name: String
    code :String
  }
  type City {
    id : String
    name: String
  }
  type Country{
    id : String
    name: String
  }
  type Vehicle{
    id : String
    type: String
    code :String
  }
  type Payment{
    id : String
    type:String
    card_no: String
    Status: Boolean
  }
  type Query{
      user: User!
  }
  type Mutation{
    createUser(name: String, email: String, password: String): User
    createJourney(start_dt:String  ,end_dt:String , duration:String) : Journey
    createPassenger(name :String , passport_data : String ) : Passenger
    createStation(name : String , code : String) :Station 
    createCity (name : String) :City 
    createCountry(name : String) : Country 
    createTrip(start_dt:String  ,end_dt:String , duration:String) : Trip 
    createVehicle(type :String ,code :String) : Vehicle 
    createPayment(type:String  , card_no: String ,status: Boolean): Payment
  }
`

module.exports = typeDefs
