const express = require('express')
const bodyParser = require('body-parser');
const config = require('./config.js')
const app = express()

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, PUT, DELETE");
  next();
});

for (const path in config) {
  const response = function(req, res) {
    const response = Object.keys(req.body).length ? req.body : config[path].response
    res.json(response)
  }

  const method = config[path].method && config[path].method.toLowerCase()
  method && app[method](path, response)
}

app.all("*", function(req, res) {
  res.json({error: 'Invalid api url'})
})

const PORT = 4000

app.listen(PORT,function() {
  console.log("Starting fake server at port: ",PORT)
})
