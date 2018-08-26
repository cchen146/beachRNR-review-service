const db = require('./index.js');
const faker = require('faker');
const sampleSize = 10;

let q = `SELECT 1 FROM listing_review LIMIT 1`;
db.connection.query(q, [], (err, results, fields) => {
  // check if this is first time set up

  var start = new Date();
  var stop;
  if(results.length === 0) {
    // create 100 mock users
    for(var i = 0; i < sampleSize; i++) {
      let user = {'name': faker.name.findName(), 'avatar': faker.image.avatar()};
      db.createUser(user,(err, results, counter) => {
        if(counter === sampleSize) {
          stop = new Date();
          console.log(counter + ' users inserted - taking ' + (stop-start)/1000 + 's');
        }
      }, i+1);
    }

      // load 6 rating type to static table rating_type
    let ratingTypes = ['Accuracy', 'Location', 'Communication', 'Checkin', 'Cleanliness', 'Value'];
    ratingTypes.forEach((ratingType, i) => {
      let rt = {'name': ratingType};
      db.createRatingType(rt, (err, results, counter) => {
        if(err){console.log(err)};
        if(counter === ratingTypes.length) {
          stop = new Date();
          console.log(counter + ' ratingType inserted - taking ' + (stop-start)/1000 + 's');
        }
      }, i+1);
    });


    // create 100 listings
    for(var i = 0; i < sampleSize; i++) {
      let listing = {'review_count': 0, 'average_rating': 0};
      db.createListing(listing,(err, results, counter) => {
        if(counter === sampleSize) {
          stop = new Date();
          console.log(counter + ' listings inserted - taking ' + (stop-start)/1000 + 's');
        }
      }, i+1);
    }

    // create 100 reviews; (update reivew count)
    // /////////update ratings for review, listing_attribute_rating, listing_review
     var reviewCounter = 0;
     for(var i = 2912000; i < (2912000 + sampleSize); i++) {
      let reviewCount = Math.floor(Math.random()*95) + 5;//generate 5 - 100 reviews per listing
      for(var j = 0; j < reviewCount; j++) {
          let r = {'listing_review_id': i,
                    'user_id': Math.floor(Math.random()*sampleSize) + 1,
                    'review_time': new Date(faker.date.recent()),
                    'review_content': faker.lorem.paragraph() + faker.lorem.paragraph()
                  };
          reviewCounter++;
          db.createReview(r, (err, results, review, counter) => {
            // each review will be submitted with ratings for six rating type
            if(err) {console.log('createReview function called Error>>>' + err)};
            if(counter % 10 === 0) {
              stop = new Date();
              console.log(counter + ' reviews inserted - taking ' + (stop-start)/1000 + 's');
            }
            for(var z = 0; z < ratingTypes.length; z++) {
              let reviewRating = {
                  review_id: results.insertId,
                  rating_type_id: z + 1,
                  star_ratings: Math.floor(Math.random() * 3) + 3
              };
              db.createReviewRating(reviewRating, review.listing_review_id, (err, results, counter2)=>{
                if(counter%10 === 0 && counter2 === 6) {
                  stop = new Date();
                  console.log(counter2 + ' type ratings for ' + counter + ' reviews inserted - taking ' + (stop-start)/1000 + 's');
                }
              }, z+1)
            }
          }, reviewCounter);
      }
    }


    // generate 100 mock review-reports
    let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
                        `This review is purposefully malicious and assaulting.`,
                        `This review contains false information or may be fake.`
                        ];
    for(var i = 0; i < sampleSize; i++) {
      let review_id = Math.floor(Math.random()*reviewCounter) +1;
      let report = {'user_id': i + 1,
                    'review_id': review_id,
                    'report_time': new Date(faker.date.recent()),
                    'report_content': reportOptions[Math.floor(Math.random()*3)]};
       db.createReviewReport(report,(err, results, counter) => {
         if(err){console.log(err)}
         if(counter%10 === 0) {
          stop = new Date();
          console.log(counter + ' reports inserted - taking ' + (stop-start)/1000 + 's');
        }
      }, i+1);
    };
  }
});


