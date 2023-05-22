const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const tipe_kamar = require('../controller/tipe-kamar-control')
const { authVerrifiy } = require('../auth/auth')
const refreshToken = require('../auth/refreshToken')
const upload = require('../controller/upload-foto').single('foto')

const app = express()
app.use(express.json())
app.use = bodyParser.urlencoded({
    extended: false
})

app.post('/add', tipe_kamar.addType)
app.get('/', tipe_kamar.getAllType)
app.post('/find', tipe_kamar.findType)
app.put('/update/:id', tipe_kamar.updateType)
app.delete('/delete/:id', tipe_kamar.deleteType)

module.exports = app