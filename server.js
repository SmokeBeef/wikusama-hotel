const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require("cors")


const dotenv = require('dotenv')
dotenv.config();

const port = process.env.PORT || 8000;
const userRoute = require('./routes/user-routes')
const tipeKamarRoute = require('./routes/tipe-kamar-routes')
const kamarRoute = require('./routes/kamar-routes')
const pemesananRoute = require('./routes/pemesanan-routes')

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false, }));
app.use('/image', express.static(path.join(__dirname, 'public')))

app.use('/user', userRoute)
app.use('/tipeKamar', tipeKamarRoute)
app.use('/kamar', kamarRoute)
app.use('/pemesanan', pemesananRoute)

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
})
