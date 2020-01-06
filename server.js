
// packages
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// folders
const session = require('./dbutiles/db')

//consts def
const app = express()
const PORT = 3000

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
app.use('/users', require('./routes/users'))

// app.use(initsession)



//run server
app.listen(PORT, () => console.log(`server running at port ${PORT}`))