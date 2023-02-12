const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 3000;
const userRoute = require('./routes/user-routes')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));

app.use(cors());

app.use('/user', userRoute)

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
})
