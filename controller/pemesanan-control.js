const modelPemesanan = require('../models/index').pemesanan
const modelDetail = require('../models/index').detail_pemesanan
const Op = require('sequelize').Op
const { response, error } = require('../helpers/wrapper')
const { v4: uuidv4 } = require('uuid')

exports.add = async (req, res) => {
    try {

        const payload = {
            nomor_pemesanan: uuidv4(),
            nama_pemesan: req.body.nama_pemesan,
            email_pemesan: req.body.email_pemesan,
            tgl_pemesanan: new Date(),
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user
        }

        const payloadDetail = {
            id_kamar: req.body.id_kamar,
            tgl_akses: req.body.tgl_akses,
            harga: req.body.harga,
            id_pemesanan: ''
        }



        const resultPemesanan = await modelPemesanan.create(payload)
            .then((result) => {
                return result
            }).catch((err) => {
                return error(err)
            });
        if (resultPemesanan.err) return response(res, 'fail', 'error', resultPemesanan.err, 409)

        payloadDetail.id_pemesanan = resultPemesanan.id
        const resultDetail = await modelDetail.create(payloadDetail)

        return response(res, 'success', 'success add pemesanan', [resultPemesanan, resultDetail], 201)
    } catch (error) {
        return response(res, 'fail', "ERRRORRRR BROHHH", error.message, 409)
    }

}

exports.findAll = async (req, res) => {

    const resultPemesanan = await modelPemesanan.findAll()
    const resultDetail = await modelDetail.findAll()

    const result = [resultPemesanan, resultDetail]

    return response(res, 'success', 'success get all pemesanan', result, 200)
}

exports.findById = async (req, res) => {
    const id = req.params.id

    const check = await modelPemesanan.findAll({
        where: {
            id: id
        }
    })

    if (check.length === 0) return response(res, 'success', 'no id found', null, 404)

    const result = await modelPemesanan.findAll({
        where: {
            id: id
        }
    })

    const resultDetail = await modelDetail.findAll({
        where: {
            id_pemesanan: id
        }
    })

    return response(res, 'success', 'success get pemesanan by id', [result[0], resultDetail[0]], 200)

}

exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const payload = {
            nama_pemesan: req.body.nama_pemesan,
            email_pemesan: req.body.email_pemesan,
            tgl_pemesanan: req.body.tgl_pemesanan,
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user
        }

        const payloadDetail = {
            id_kamar: req.body.id_kamar,
            tgl_akses: req.body.tgl_akses,
            harga: req.body.harga,
        }

        const checkId = await modelPemesanan.findAll({
            where: {
                id: id
            }
        })

        if (checkId.length === 0) return response(res, 'success', 'cannot find id', checkId, 409)

        const result = await modelPemesanan.update(payload, {
            where: {
                id: id
            }
        })
        const resultDetail = await modelDetail.update(payloadDetail, {
            where: {
                id_pemesanan: id
            }
        })

        return response(res, 'success', 'success update', [result, resultDetail], 201)

    } catch (error) {
        return response(res, 'fail', 'cannot update..... ERROR', error, 400)
    }

}


exports.delete = async (req, res) => {
    const id = req.params.id

    const checkId = await modelPemesanan.findAll({
        where: {
            id: id
        }
    })

    if (checkId.length === 0) return response(res, 'success', 'cannot find id', checkId, 409)

    const result = await modelPemesanan.destroy({
        where: {
            id: id
        }
    })
    const resultDetail = await modelDetail.destroy({
        where: {
            id_pemesanan: id
        }
    })
    return response(res, 'success', 'success delete pemesanan', [result, resultDetail], 200)
}
