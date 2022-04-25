const config = require('./config/config');
const path = require('path');
const connection = require('./connection/connect');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const route = require('./route');
const server = require('http').createServer(app);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/static', express.static(path.join(__dirname, '../server/uploads/')));

app.use('/api', route);
// const multer = require("multer")
// app.use(multer().array())



connection.connect().then(success => {
    server.listen(config.port, () => {
          console.log(`Running on port ${config.port}.`);
          console.log(success);
      });
  }).catch(error => {
      console.log('Db not connected!')
  });