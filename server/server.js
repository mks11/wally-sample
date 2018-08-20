const express = require('express')
const app = express()
const config = require('./config.js')


app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

for (const path in config) {
  const func = config[path].method == 'POST' ? app.post : app.get
  const response = function(req, res) {
    res.json(config[path].response)
  }

  if (config[path].method=='POST') {
    app.post(path, response)
  } else {
    app.get(path, response)
  } 
}

app.all("*", function(req, res) {
  res.json({error: 'Invalid api url'})
})

app.listen(4000,function() {
  console.log("Starting fake server")
})
