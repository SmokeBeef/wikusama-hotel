const modelKamar = require('../models/index').kamar
const tipeKamarModel = require('../models/index').tipe_kamar
const Op = require('sequelize').Op
const { response, error } = require('../helpers/wrapper')

exports.addKamar = async (req, res) => {

    const newKamar = {
        nomor_kamar: req.body.nomor_kamar,
        id_tipe_kamar: req.body.id_tipe_kamar
    }
    const cek = await modelKamar.findAll({
        where: {
            nomor_kamar: newKamar.nomor_kamar
        }
    })
    if (cek.lenght === 0) return response(res, 'fail', 'nomor kamar already exist', null, 409)

    const cekIdTipeKamar = await tipeKamarModel.findAll({
        where: {
            id: newKamar.id_tipe_kamar
        }
    })
    if (cekIdTipeKamar.lenght === 0) return response(res, 'fail', 'id tipe kamar not found', null, 409)
    
    const insert = modelKamar.create(newKamar)

    return response(res, 'true', 'success add', insert, 201)

}

exports.findAll = async (req, res) => {
    const result = await modelKamar.findAll()

    if (result.lenght === 0) return response(res, 'success', 'zero kamar', result, 200)
    return response(res, 'success', 'get all user', result, 200)
}


exports.findById = async (req, res) => {
    const payload = req.params.id

    const result = await modelKamar.findAll({
        where: {
            id: payload
        }
    })

    if (!result[0]) return response(res, 'success', 'get kamar and 0 data', result,200)

    return response(res, 'success', 'success get kamar', result[0], 200)

}

// exports.search = async (req, res) => {
//     const payload = req.params.search

//     const result = await modelKamar.findAll({
//         where: {
//             [Op.or]: [
//                 {nomor_kamar: {[Op.substring]: payload}},
//                 {id_tipe_kamar: {[Op.substring]: payload}},
//             ]
//         }
//     })
// }

exports.update = async (req, res) => {
    try {
        const params = req.params.id
        const payload = {
            nomor_kamar: req.body.nomor_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar
        }

        const check = await modelKamar.findAll({
            where: {
                nomor_kamar: payload.nomor_kamar
            }
        })
        if (check.length > 0) return response(res, 'fail', 'nomor kamar already exist', check, 404)

        const checkId = await modelKamar.findAll({
            where: {
                id: params
            }
        })
        if (checkId.length === 0) return response(res, 'fail', 'id not found', null, 404)

        const result = modelKamar.update(payload, {
            where: {
                id: params
            }
        })

        return response(res, 'success', 'update kamar', result, 201)

    } catch (error) {
        return response(res, 'fail', error.message, error, 400)
    }
}

exports.delete = async (req, res) => {
    try {

        const payload = req.params.id

        const cek = await modelKamar.findAll({
            where: {
                id: payload
            }
        })
        if (cek.length === 0) return response(res, 'fail', 'id not found', null, 404)

        const result = await modelKamar.destroy({
            where: {
                id: payload
            }
        })

        return response(res, 'success', 'success delete kamar', result, 200)
    } catch (error) {

        return response(res, 'fail', error.message, error, 400)

    }

}