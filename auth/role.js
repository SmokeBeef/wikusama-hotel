const { response } = require('../helpers/wrapper')


exports.admin =  (req, res, next) => {
    console.log("header", req.cookies);
    try {
        const header = req.headers
        console.log("from cookis", header);

        const role =  req.cookies.role
        console.log(role);
        if (role !== "admin" && role !== "resepsionis") {
            return res.status(403).json({
                message: "only admin and resepsionis can access this!"
            })
        }
    
        if (role !== "admin") {
            return res.status(403).json({
                message: "only admin can access this!"
            })
        }
        next()
    } catch (error) {
        return res.json({
            message: error
        })
    }
}

exports.resepsionis = async (req, res, next) => {
    const role = req.cookies.role

    if (role !== "admin" && role !== "resepsionis") {
        return res.status(403).json({
            message: "only admin and resepsionis can access this!"
        })
    }

    if (role !== "resepsionis") return res.status(403).json({
        message: "only admin and resepsionis can access this!"
    })
    next()
}

