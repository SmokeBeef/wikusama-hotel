const tipeKamarModel = require('../models/index').tipe_kamar
const Op = require('sequelize').Op
const wrapper = require('../helpers/wrapper')
const upload = require('./upload-tipe-kamar').single('foto')
const tipeKamar = require('../helpers/validatePayload/tipe-kamar-val')
const path = require('path')
const fs = require('fs')
const { validatePayload } = require('../helpers/validator')
const { isEmpty } = require('validate.js')


exports.getAllType = async (request, response) => {
    let tipe = await tipeKamarModel.findAll();
    if (tipe.length === 0) {
        return wrapper.response(response, 'success', 'get nothing', null, 200)
    }
    return response.json({
        success: true,
        data: tipe,
        message: `All room have been loaded`,
    });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findType = async (request, response) => {
    let search = request.body.search;

    let tipe = await tipeKamarModel.findOne({
        where: {
            [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: search } },
            { deskripsi: { [Op.substring]: search } }
            ],
        },
    });
    if (!tipe) {
        return response.json({
            success: false,
            message: "nothing tipe Room to show",
        });
    }

    return response.json({
        success: true,
        data: tipe,
        message: `Tipe Room have been loaded`,
    });
};

//menambah data
exports.addType = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({ message: error });
        }

        if (!request.file) {
            return response.json({ message: `Nothing to upload` });
        }

        console.log("p");
        let newType = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            foto: request.file.filename
        };

        console.log(newType.foto);
        const result = validatePayload(tipeKamar.tipe_kamar_schema, newType)
        // const result = tipeKamar.tipe_kamar_schema.validate(newType)
        console.log(result);
        if (result.err) {
            const oldFotoUser = newType.foto;
            const patchFoto = path.join(__dirname, `../public/foto_kamar`, oldFotoUser);
            console.log(patchFoto);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            } else {
                return response.json({
                    error: "error"
                })
            }

            return wrapper.response(response, 'fail', 'error input type', null, 400)

        }


        if (
            newType.nama_tipe_kamar === "" ||
            newType.harga === "" ||
            newType.deskripsi === ""
        ) {
            const oldFotoUser = newType.foto;
            const patchFoto = path.join(__dirname, `../public/foto_kamar`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }
            return response.json({
                success: true,
                message: "Harus diisi semua",
            });
        }

        let tipe = await tipeKamarModel.findAll({
            where: {
                [Op.and]: [{ nama_tipe_kamar: newType.nama_tipe_kamar }],
            },
        });

        if (tipe.length > 0) {
            //karena gagal hapus foto yang masuk
            const oldFotoUser = newType.foto;
            const patchFoto = path.join(__dirname, `../public/foto_kamar`, oldFotoUser);
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }
            return response.json({
                success: false,
                message: "Nama tipe kamar yang anda inputkan sudah ada",
            });
        }
        tipeKamarModel.create(newType)
            .then((result) => {
                return response.json({
                    success: true,
                    data: result,
                    message: `New Type Room has been inserted`,
                });
            })
            .catch((error) => {
                return response.json({
                    success: false,
                    message: error.message,
                });
            });
    });
};

//mengupdate salah satu data
exports.updateType = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.json({ message: error });
        }

        let idType = request.params.id;

        let getId = await tipeKamarModel.findAll({
            where: {
                [Op.and]: [{ id: idType }],
            },
        });

        if (getId.length === 0) {
            return response.json({
                success: false,
                message: "Type dengan id tersebut tidak ada",
            });
        }

        let dataType = {
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi
        };

        if (request.file) {
            const selectedUser = await tipeKamarModel.findOne({
                where: { id: idType },
            });

            const oldFotoUser = selectedUser.foto;

            const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);

            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }
            dataType.foto = request.file.filename;
        }

        if (
            dataType.nama_tipe_kamar === "" ||
            dataType.harga === "" ||
            dataType.deskripsi === ""
        ) {
            return response.json({
                success: false,
                message:
                    "Harus diisi semua kalau tidak ingin merubah isi dengan value sebelumnya",
            });
        }


        let kamars = await tipeKamarModel.findAll({
            where: {
                [Op.and]: [
                    { id: { [Op.ne]: idType } },
                    {
                        [Op.and]: [
                            { nama_tipe_kamar: dataType.nama_tipe_kamar },
                        ],
                    },
                ],
            },
            attributes: ["id", "nama_tipe_kamar", "harga", "deskripsi", "foto"],
        });
        if (kamars.length > 0) {
            return response.json({
                success: false,
                message: `Kamar yang anda inputkan sudah ada`,
            });
        }

        tipeKamarModel
            .update(dataType, { where: { id: idType } })
            .then((result) => {
                return response.json({
                    success: true,
                    message: `Data room type has been update`,
                });
            })
            .catch((error) => {
                return response.json({
                    success: false,
                    message: error.message,
                });
            });
    });
};

//mengahapus salah satu data
exports.deleteType = async (request, response) => {
    let idType = request.params.id;

    let getId = await tipeKamarModel.findAll({
        where: {
            [Op.and]: [{ id: idType }],
        },
    });

    if (isEmpty(getId)) {
        return response.json({
            success: false,
            message: "Tipe dengan id tersebut tidak ada",
        });
    }

    const tipe = await tipeKamarModel.findOne({ where: { id: idType } });

    const oldFotoUser = tipe.foto;

    const patchFoto = path.join(__dirname, `../public/foto-kamar`, oldFotoUser);
    console.log(patchFoto);
    console.log(fs.existsSync(patchFoto));

    fs.unlink(patchFoto, (err) => {
        console.log(err);
    });



    tipeKamarModel
        .destroy({ where: { id: idType } })
        .then((result) => {
            return response.json({
                success: true,
                message: `data room type has ben delete`,
            });
        })
        .catch((error) => {
            return response.json({
                success: false,
                message: error.message,
            });
        });
};