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
  type Vehicle{
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
