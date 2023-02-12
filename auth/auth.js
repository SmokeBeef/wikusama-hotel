const jswebtoken = require("jsonwebtoken");

const authVerrifiy = async (req, res, next) => {

    try{
        const header = req.headers.authorization
        if(header ==null){
            return res.status(402).json({
                message: 'missing token',
                err: null
            })
        }
        let token = header.split(" ")[1]
        const SECRET_KEY = 'secretcode'
        let decodedToken
        try{
            decodedToken = await jswebtoken.verify(token,SECRET_KEY)
        } catch(err){
            if(err instanceof jswebtoken.TokenExpiredError){

                return res.status(401).json({
                    message: `token expired`,
                    err: err
                })
            }
            return res.status(401).json({
                message: `invalid token`,
                err: err
            })
        }
        req.userData = decodedToken
        next()
    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: `internal error`,
            err: err
        })

    }

}
module.exports = {authVerrifiy}