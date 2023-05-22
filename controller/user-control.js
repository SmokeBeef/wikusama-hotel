const md5 = require("md5");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize").Op;
const wrapper = require('../helpers/wrapper')
require('dotenv').config()


const modalUser = require("../models/index").user;
const upload = require("./upload-foto").single("foto");
const authVerify = require("../auth/auth");
const { response } = require("express");

// login
exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const params = {
      email: req.body.email,
      password: md5(req.body.password),
    };

    const findUser = await modalUser.findOne({
      where: {
        email: params.email
      },
      attributes: ['id', 'nama_user', 'password', 'foto', 'email', 'role']
    });

    console.log(findUser);

    if (findUser === null) {
      return wrapper.response(res, 'fail', 'user email not found', null, 202);
    }

    const user = findUser.dataValues
    console.log(user);

    if (user.password != params.password) {
      return wrapper.response(res, 'fail', 'password wrong', null, 202)
    }

    let Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };



    const SECRET_KEY = process.env.SECRET_KEY
    const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY
    const token = jwt.sign(Payload, SECRET_KEY, { expiresIn: '15s' });
    const refreshToken = jwt.sign(Payload, refreshTokenSecretKey, { expiresIn: '1d' });

    await modalUser.update({ refreshToken: refreshToken }, {
      where: {
        id: Payload.id
      }
    })

    const dataSend = {
      id: user.id,
      nama: user.nama_user,
      email: user.email,
      foto: user.foto,
      role: user.role,
      token
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.cookie('role', dataSend.role, {
      httpOnly: true,
    })

    return wrapper.response(res, 'success', 'Success Login', dataSend, 200)
  } catch (err) {
    return res.status(500).json({
      message: `Internal Error`,
      err: err.message

    })
  }
};
// end of login

// Log out 
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204)
  const user = await modalUser.findOne({
    where: {
      refreshToken: refreshToken
    }
  })
  if (!user) return res.sendStatus(204)
  const id = user.id
  await modalUser.update({
    refreshToken: null,
  }, {
    where: {
      id: id
    }
  })
  res.clearCookie('refreshToken')
  res.clearCookie('role')
  return wrapper.response(res, 'succcess', 'success logout', null, 200)
}

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

    const check = await modalUser.findOne({ where: { email: newUser.email } })
    console.log(check);
    if (check != null) {
      return res.status(200).json({
        succes: false,
        message: 'email has been register'
      })
    }

    modalUser.create(newUser)
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
  })
};

exports.getUserLogin = async (req,res) => {
  const userData = req.userData;
    return res.json({data : userData})
}
// end of add user

// get all user
exports.getAllUser = async (req, res) => {

  await modalUser.findAll()
  .then((result) => {
    return wrapper.response(res, 'success', 'success get all user', result, 200)
  }).catch((error) => {
    return res.json({
      succes: false,
      message: error.message,
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
  const cari = req.body.search;
  
  

  const cariUser = await modalUser.findAll({
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
    // let oldUser = modalUser.findOne({ where: { id: id } })

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
    modalUser.update(newUser, { where: { id: id } })
      .then(result => {
        return res.status(200).json({
          succes: `true`,
          message: `data has been updated`
          , result
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
exports.deleteUser = async (req, res) => {
  try {
    let id = req.params.id
    console.log(id);
    const getUser = async () => {
      let hasil
      await modalUser.findOne({
        where: {
          id: id
        }
      }).then(result => {
        console.log(result.dataValues);
        hasil = result.dataValues

      }).catch(err => {
        console.log(err);
        hasil = err
      })
      return hasil
    }
    const user = await getUser()
    console.log('ini user : ', user);

    console.log(user.foto);
    const filePath = path.join(__dirname, '../public/foto-user', user.foto)

    fs.unlink(filePath, (err) => {
      if (err && err.code == "ENOENT") {
        console.log('succes delete foto user');
      }
    })


    await modalUser.destroy({ where: {id: id} })
      .then(result => {
        return res.status(200).json({
          message: `succes`,
          result: `data : ${result} has been deleted`
        })
      })
      .catch(err => {
        return res.status(500).json({
          message: `cant delete user`
          , err: err.message
        })
      })

  } catch (err) {
    return res.status(500).json({
      message: `error`,
      err: err.message
    })
  }
}
// end of delete user