const jwt = require('jsonwebtoken')
const Users = require("../models/index").user;

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = await req.cookies.refreshToken
        console.log("TOKEN  ",refreshToken);
        if (!refreshToken) return res.sendStatus(401)
        const user = await Users.findAll({
            where: {
                refreshToken: refreshToken
            }
        })
        console.log("halooo ", user);
        if (!user[0]) return res.sendStatus(403)

        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) res.sendStatus(403)
            const userId = user[0].id
            const email = user[0].email
            const role = user[0].role
            const accessToken = jwt.sign({ id: userId, email, role }, process.env.SECRET_KEY,
                { expiresIn: '60s' }
            )
            console.log("acces token ",accessToken);
            res.json({ accessToken: accessToken })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'error',
            error: error
        })
    }
}