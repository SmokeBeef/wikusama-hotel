const tipe_kamar = require('../models/index').tipe_kamar
const sequelize = require('sequelize').Op

exports.addTipeKamar = (req, res) => {

    try {
        let newTipeKamar = {
            nama_tipe_kamar: nama_tipe_kamar,
            harga: harga,
            deskripsi: deskripsi
        }

        tipe_kamar.create(newTipeKamar)
            .then(result => {
                return res.status(200).json({
                    message: `success create new tipe kamar`,
                    data: result
                })
            }).catch(err => {
                return res.status(500).json({
                    message: `cant create tipe Kamar`,
                    err: err
                })
            })

    }
    catch (err) {
        return res.status(500).json({
            err: err,
            message: `cant create new tipe kamar`
        })
    }
}

exports.updateTipekamar = async (req, res) => {



}