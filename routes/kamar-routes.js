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

