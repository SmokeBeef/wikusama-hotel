const multer = require('multer')
const fs = require('fs')
const tipeKamarModel = require('../models/index').tipe_kamar
const Op = require('sequelize').Op


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/foto-kamar')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        const acceptedFile = [`image/jpg`, `image/png`, `image/jpeg`];
        if (!acceptedFile.includes(file.mimetype)) {
            cb(null, false);
            return cb(`invalid file tipe (${file.mimetype})`);
        }
        const newData = {
            nama_tipe_kamar: req.body.nama_tipe_kamar,
            harga: req.body.harga,
            deskripsi: req.body.deskripsi,
            foto: file.filename
        }
        const check = async () => {
            const data = await tipeKamarModel.findAll({
                where: {
                    [Op.and]: [{ nama_tipe_kamar: newData.nama_tipe_kamar }]
                }
            })
                .then((result) => {
                    console.log(result);
                    return result
                }).catch((err) => {
                    console.log('error from upload tipe kamar', err);
                    return err
                });
                return await data
        }
        const cek = check()
        console.log(cek);
        if(cek[0]){
            cb(null, false)
            return cb('nama_tipe_kamar already used')
        }

        const fileSize = req.headers[`content-length`];
        const maxSize = 1 * 1024 * 1024;
        if (fileSize > maxSize) {
            cb(null, false)
            return cb(`File size is too large`)
        }
        cb(null, true)
    },
});

module.exports = upload