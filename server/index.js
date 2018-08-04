const express = require('express');
const app = express();
const db = require('../data/mockData.js');


app.get('/*', (req, res) => {
  res.send('hello world!');
});

app.get('/rooms/:id/reviews', (req, res) => {

// { listingId: ,
//   listingRating: 5,
//   ratingTypeStars: {
//     'accuracy': 3,
//     'sdfd': 3,
//     ...
//   },
//   reviews: [
//   {username: , avatar: , review_time: , review_content},
//    ...],
// }
});



app.listen('3003', ()=>{console.log('listening to port 3003!')});