const express = require('express')
const app = express.Router()
const auth = require('../auth/auth')

const controller = require('../controller/pemesanan-control')

app.post('/', controller.add)
app.get('/', controller.findAll)
app.get('/id/:id', controller.findById)
app.put('/id/:id', controller.update)
app.delete('/del/:id', controller.delete)

module.exports = app