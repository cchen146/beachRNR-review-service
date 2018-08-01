const db = require('./index.js');
const faker = require('faker');
const sampleSize = 100;


// create 100 users
let users = [];

for(var i = 0; i < sampleSize; i++) {
  users.push({'name': faker.name.findName(), 'avatar': faker.image.avatar()});
}

db.createUser(users,(err, results) => {});

// create 100 listings
let listings = [];

for(var i = 0; i < sampleSize; i++) {
  listings.push({'review_count': 0, 'average_rating': 0});
}

db.createListing(listings,(err, results) => {});

// create 100 reviews; (update reivew count)
let reviews = [];

for(var i = 0; i < sampleSize; i++) {
  reviews.push({'listing_review_id': i+2912000,
                'user_id': i+1,
                'review_content': faker.lorem.paragraph() + faker.lorem.paragraph()});
}

db.createReview(reviews,(err, results) => {console.log(err);});

// generate 100 mock review-reports
let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
                    `This review is purposefully malicious and assaulting.`,
                    `This review contains false information or may be fake.`
                    ];
let reports = [];

for(var i = 0; i < sampleSize; i++) {
  reports.push({'user_id': i+1,
                'review_id': i+1,
                'report_content': reportOptions[Math.floor(Math.random()*3)]});
};

db.createReviewReport(reports,(err, results) => {console.log(err)});

// load 6 rating type to static table rating_type
let ratingTypes = ['Accuracy', 'Location', 'Communication', 'Checkin', 'Cleanliness', 'Value'];
let results = [];
ratingTypes.forEach(ratingType => {
  results.push({'name': ratingType});
});

db.createRatingType(results, (err, results) => {console.log(err)});

