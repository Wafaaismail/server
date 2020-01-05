
// packages
const express = require('express')


// folders
const session = require('./dbutiles/db')

//consts def
const app = express()
const PORT = 3000

//Routes
app.use('/users', require('./routes/users'))

// app.use(initsession)



//run server
app.listen(PORT, () => console.log(`server running at port ${PORT}`))