const joi = require('joi')

const tipe_kamar_schema = joi.object({
    nama_tipe_kamar: joi.string().required(),
    harga: joi.number().required(),
    deskripsi: joi.string().required(),
    foto: joi.string().required(),
})

module.exports = {
    tipe_kamar_schema
}