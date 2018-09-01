const express = require('express');
const app = express();
const dbTools = require('../data/dbHelperFunctions.js');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/rooms/:id/reviews/ratings', (req, res) => {
  let listingId = req.params.id;
  dbTools.readReviewRatings(listingId,(err, results) => {
    res.send(results);
  })
});


app.get('/rooms/:id/reviews/ratingnreviewcount', (req, res) => {
  let listingId = req.params.id;
  dbTools.readRatingNReviewCount(listingId,(err, results) => {
    res.send(results[0]);
  })
});


app.get('/rooms/:id/reviews/content', (req, res) => {
  let listingId = req.params.id;
  dbTools.readReviewContent(listingId,(err, results) => {
    res.send(results);
  })
});

app.get('/rooms/:id/reviews/*', (req, res) => {
  res.status(404).end();
});


var server = app.listen('80', ()=>{console.log('listening to port 80!')});

module.exports.app = app;
module.exports.server = server;



