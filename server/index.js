const express = require('express');
const app = express();
const dbTools = require('../data/dbHelperFunctions.js');
const {generateMockData} = require('../data/bulkMockDataGeneration.js');
const {deleteDirFilesUsingPattern} = require('../utils/dataGeneration.js');
const runLoadFiles = require('../data/bulkImport.js').runLoadFiles;
const path = require('path');


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

app.get('/rooms/reviews/generateMockData/:size/:chunkSize', (req, res) => {
    var size = req.params.size;
    var chunkSize = req.params.chunkSize;
    deleteDirFilesUsingPattern('*/*', path.join(__dirname, '../data/mockData/')).then(() => {
      generateMockData(size, chunkSize);
    })
    res.send('mock data generated!');
 });

app.get('/rooms/reviews/importMockData', (req, res) => {
  var start = new Date();
  dbTools.dropDatabase(() => {
    dbTools.setupDatabase(()=> {
      runLoadFiles().then(() => {
        dbTools.updateReviewCount(()=> {
          dbTools.updateListingRatings(() => {
            dbTools.updateListingAttrRatings(() => {
              var stop = new Date();
              res.send('import completed taking ' + (stop - start)/1000 + 's');
            })
          })
        })
      });
    });
  });  
})


var server = app.listen('80', ()=>{console.log('listening to port 80!')});


module.exports.app = app;
module.exports.server = server;



