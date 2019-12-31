
// packages
const express = require('express')


// folders
const initsession = require('./dbutiles/db')

//consts def
const app = express()
const PORT = 3000

app.use(initsession)

//run server
app.listen(PORT,()=> console.log(`server running at port ${PORT}`))