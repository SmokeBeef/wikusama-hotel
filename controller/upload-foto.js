const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./foto-user");
  },
  filename: (req, file, cb) => {
    
    cb(null, `photo-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const acceptedFile = [`image/jpg`, `image/png`, `image/jpeg`];
    if (!acceptedFile.includes(file.mimetype)) {
      cb(null, false);
      return cb(`invalid file tipe (${file.mimetype})`);
    }
    const fileSize = req.headers[`content-length`];
    const maxSize = 1 * 1024 * 1024;
    if(fileSize > maxSize){
        cb(null,false)
        return cb(`File size is too large`)
    }
    cb(null,true)
  },
});


module.exports = upload