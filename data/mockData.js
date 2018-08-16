const db = require('./index.js');
const faker = require('faker');
const sampleSize = 100;

let q = `SELECT 1 FROM listing_review LIMIT 1`;

db.connection.query(q, [], (err, results, fields) => {
  // check if this is first time set up

  if(results.length === 0) {
    // create 100 mock users
    let users = [];

    for(var i = 0; i < sampleSize; i++) {
      users.push({'name': faker.name.findName(), 'avatar': faker.image.avatar()});
    }

    db.createUser(users,(err, results) => {});


    // load 6 rating type to static table rating_type
    let ratingTypes = ['Accuracy', 'Location', 'Communication', 'Checkin', 'Cleanliness', 'Value'];
    let results = [];
    ratingTypes.forEach(ratingType => {
      results.push({'name': ratingType});
    });

    db.createRatingType(results, (err, results) => {if(err){console.log(err)}});

    // create 100 listings
    let listings = [];

    for(var i = 0; i < sampleSize; i++) {
      listings.push({'review_count': 0, 'average_rating': 0});
    }

    db.createListing(listings,(err, results) => {});

    // create 100 reviews; (update reivew count)
    // /////////update ratings for review, listing_attribute_rating, listing_review
    let reviews = [];

    for(var i = 2912000; i < (2912000 + sampleSize); i++) {
      let reviewCount = Math.floor(Math.random()*95) + 5;//generate 5 - 100 reviews per listing
      for(var j = 0; j < reviewCount; j++) {
          reviews.push({'listing_review_id': i,
                        'user_id': Math.floor(Math.random()*sampleSize) + 1,
                        'review_time': new Date(faker.date.recent()),
                        'review_content': faker.lorem.paragraph() + faker.lorem.paragraph()
                      });
      }
    }
    db.createReviews(reviews, (err, results, review) => {
      // each review will be submitted with ratings for six rating type
      for(var i = 0; i < ratingTypes.length; i++) {
        let reviewRating = {
           review_id: results.insertId,
           rating_type_id: i + 1,
           star_ratings: Math.floor(Math.random() * 3) + 3
        };
        db.createReviewRating(reviewRating, review.listing_review_id, ()=>{})
      }
    });

    // generate 100 mock review-reports
    let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
                        `This review is purposefully malicious and assaulting.`,
                        `This review contains false information or may be fake.`
                        ];
    let reports = [];
    for(var i = 0; i < sampleSize; i++) {
      reports.push({'user_id': i + 1,
                    'review_id': i + 1,
                    'report_time': new Date(faker.date.recent()),
                    'report_content': reportOptions[Math.floor(Math.random()*3)]});
    };

    db.createReviewReport(reports,(err, results) => {if(err){console.log(err)}});

  }
});


