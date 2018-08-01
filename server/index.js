const express = require('express');
const app = express();
const db = require('../data/mockData.js');


app.get('/*', (req, res) => {
  res.send('hello world!');
})


app.listen('3003', ()=>{console.log('listening to port 3003!')});