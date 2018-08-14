const express = require('express');
const app = express();
const db = require('../data/index.js');

if(process.env.NODE_ENV !== 'test') {
  const mockData = require('../data/mockData.js');
};


app.get('/rooms/:id/reviews/ratings', (req, res, next) => {
  let listingId = req.params.id;
  db.readReviewRatings(listingId,(err, results) => {
    err ? next(err) : res.send(results);
  })
});


app.get('/rooms/:id/reviews/ratingnreviewcount', (req, res, next) => {
  let listingId = req.params.id;
  db.readRatingNReviewCount(listingId,(err, results) => {
    err ? next(err) : res.send(results[0]);
  })
});


app.get('/rooms/:id/reviews/content', (req, res, next) => {
  let listingId = req.params.id;
  db.readReviewContent(listingId,(err, results) => {
    err? next(err) : res.send(results);
  })
});

// app.post('/rooms/:id/reviews/content', (req, res) => {

// });

// app.put('/rooms/:id/reviews/content', (req, res) => {

// });

// app.delete('/rooms/:id/reviews/content', (req, res) => {

// });

app.get('/rooms/:id/reviews/*', (req, res) => {
  res.status(404).end();
});

var server = app.listen('3003', ()=>{console.log('listening to port 3003!')});

module.exports.app = app;
module.exports.server = server;

