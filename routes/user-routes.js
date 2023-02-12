const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const user = require('../controller/user-control')
const auth = require('../auth/auth')


const app = express()
app.use(express.json())
app.use = bodyParser.urlencoded({
    extended: false
})


app.post('/login', user.login)
app.post('/addUser', user.addUser)
app.get('/', user.getAllUser)
app.post('/findUser', user.findUser)
app.put('/update/:id', user.updateUser)
app.delete('/delete/:id', user.deleteUser)


module.exports = app