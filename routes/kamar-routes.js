const express = require('express')
const app = express.Router()
const auth = require('../auth/auth')

const controller = require('../controller/kamar-control')




app.get('/', controller.findAll)
app.get('/id/:id', controller.findById)
app.post('', controller.addKamar)
app.put('/id/:id', controller.update)
app.delete('/del/:id', controller.delete)

module.exports = app