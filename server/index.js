const express = require('express');
const app = express();
const mockData = require('../data/mockData.js');
const db = require('../data/index.js');


app.get('/rooms/:id/reviews/ratings', (req, res) => {
  let listingId = req.params.id;
  db.readReviewRatings(listingId,(err, results) => {
    console.log(results);
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

// app.post('/rooms/:id/reviews/content', (req, res) => {

// });

// app.put('/rooms/:id/reviews/content', (req, res) => {

// });

// app.delete('/rooms/:id/reviews/content', (req, res) => {

// });

app.get('/*', (req, res) => {
  res.send('hello world!');
});

app.listen('3003', ()=>{console.log('listening to port 3003!')});