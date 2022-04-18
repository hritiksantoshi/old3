const config = require('./config/config');
const connection = require('./connection/connect');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const route = require('./route');
const server = require('http').createServer(app);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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