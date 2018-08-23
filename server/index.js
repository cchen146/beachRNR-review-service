const express = require('express');
const app = express();
const db = require('../data/index.js');

if(process.env.NODE_ENV === 'production') {
  const mockData = require('../data/mockData.js')
};



app.get('/rooms/:id/reviews/ratings', (req, res) => {
  let listingId = req.params.id;
  db.readReviewRatings(listingId,(err, results) => {
    res.send(results);
  })
});


app.get('/rooms/:id/reviews/ratingnreviewcount', (req, res) => {
  let listingId = req.params.id;
  db.readRatingNReviewCount(listingId,(err, results) => {
    res.send(results[0]);
  })
});


app.get('/rooms/:id/reviews/content', (req, res) => {
  let listingId = req.params.id;
  db.readReviewContent(listingId,(err, results) => {
    res.send(results);
  })
});

app.get('/rooms/:id/reviews/*', (req, res) => {
  res.status(404).end();
});

var server = app.listen('3003', ()=>{console.log('listening to port 3003!')});


module.exports.app = app;
module.exports.server = server;



