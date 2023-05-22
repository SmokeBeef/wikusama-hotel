const express = require('express')
const user = require('../controller/user-control')
const { authVerrifiy } = require('../auth/auth')
const { refreshToken } = require('../auth/refreshToken')
const upload = require('../controller/upload-foto').single('foto')
const { admin } = require('../auth/role')

const app = express.Router()



app.post('/login', user.login)
app.post('/addUser', admin, user.addUser)
app.get('/', admin, authVerrifiy, user.getAllUser)
app.post('/findUser', authVerrifiy, user.findUser)
app.put('/update/:id', authVerrifiy, user.updateUser)
app.delete('/delete/:id', authVerrifiy, user.deleteUser)
app.get('/token', refreshToken)
app.delete('/logout', user.logout)



module.exports = app