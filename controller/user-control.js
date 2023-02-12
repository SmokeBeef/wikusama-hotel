const { request } = require("express");
const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const { json } = require("body-parser");
const { jsonwebtoken } = require("jsonwebtoken");
const sequelize = require("sequelize").Op;

const modalUser = require("../models/index").user;
const upload = require("./upload-foto").single("foto");
const authVerrifiy = require("../auth/auth");

// login
exports.login = async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      password: md5(req.body.password),
    };
    const findUser = await modalUser.findOne({ where: params });
    if (findUser == null) {
      return res.status(404).json({
        message: `email or password doesnt match`,
        error: error,
      });
    }
    console.log(findUser);
    let tokenPayload = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };
    tokenPayload = JSON.stringify(tokenPayload);
    let token = await jsonwebtoken.sign(tokenPayload, se);
    return res.status(200).json({
      message: `Success Login`,
      data: {
        token: token,
        tokenPayload
      }
    })
  } catch (err) {
    return res.status(500).json({
      message: `Internal Error`,
      err: err
    })
  }
};
// end of login

// add user
exports.addUser = (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.json({ message: error });
    }
    /** check if file is empty */
    if (!req.file) {
      return res.json({
        message: `Nothing to Upload`,
      });
    }

    let newUser = {
      nama_user: req.body.nama_user,
      email: req.body.email,
      password: md5(req.body.password),
      role: req.body.role,
      foto: req.file.filename,
    };

    modalUser
      .create(newUser)
      .then((result) => {
        return res.json({
          succes: true,
          data: result,
          message: "New user has been insert",
        });
      })
      .catch((error) => {
        return res.json({
          succes: false,
          message: error.message,
        });
      });
  });
};
// end of add user

// get all user
exports.getAllUser = async (req, res) => {
  await modalUser.findAll().then((result) => {
    return res
      .json({
        succes: true,
        data: result,
        message: `all user has been get`,
      })
      .catch((error) => {
        return res.json({
          succes: false,
          message: error.message,
        });
      });
  });
};
// end of get all user

// find user
exports.findUser = async (req, res) => {
  // let user = {
  //   id: req.body.id,
  //   nama_user: req.body.nama_user,
  //   email: req.body.email
  // }
  let cari = req.body.cari;

  let cariUser = await modalUser.findAll({
    where: {
      [sequelize.or]: [
        { id: { [sequelize.substring]: cari } },
        { nama_user: { [sequelize.substring]: cari } },
        { email: { [sequelize.substring]: cari } },
        { role: { [sequelize.substring]: cari } },
      ],
    },
  });
  return res.json({
    succes: true,
    data: cariUser,
    message: `succes`,
  });
};
// end of find user

// Update User
exports.updateUser = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      res.json({ message: error });
    }
    let id = req.params.id;

    console.log(id)

    let newUser = {
      nama_user: req.body.nama_user,
      email: req.body.email,
      password: md5(req.body.password),
      role: req.body.role,
      foto: req.file.filename,
    };
    let oldUser = modalUser.findOne({where: {id: id}})

    if (req.file) {
      const selectedFoto = await modalUser.findOne({
        where: { id: id },
      });
      const oldFoto = selectedFoto.foto;
      const pathFoto = path.join(__dirname, "../foto-user", oldFoto);

      if (fs.existsSync(pathFoto)) {
        fs.unlink(pathFoto, (error) => console.log(error));
      }
      newUser.foto = req.file.filename
    }
    modalUser.update(newUser, {where: {id: id}})
    .then(result => {
      return res.status(200).json({
        succes: `true`,
        message: `data has been updated`
      })
    }).catch(err => {
      return res.status(500).json({
        message: `cant update user`
      })
    })
  });
};
// end of update user


// Delete User 
exports.deleteUser = async (req,res) => {
  try{
  let id = {
    id: req.params.id
  }
  let user = modalUser.findOne({where: id})
  
  const fotoUser = user.foto

  const pathFoto = path.join(__dirname,`../foto-user`, fotoUser)

  

if(fs.existsSync(pathFoto)){
  fs.unlink(pathFoto, err => console.log(err))
}

  modalUser.destroy({where: id})
  .then( result => {
    return res.status(200).json({
      message: `succes`,
      result: `data : ${result} has been deleted`
    })
  })
  .catch(err => {
    return res.status(500).json({
      message: `cant delete user`
      , err: err
    })
  })

  }catch(err){
    return res.status(500).json({
      message: `error`,
      err: err
    })
  }
}
// end of delete user