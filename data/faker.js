var faker = require('faker');

var randomName = faker.name.findName();
var randomEmail = faker.internet.email();
var randomCard = faker.helpers.createCard();

var reviews = [];
for(var i = 0; i <=10; i++) {
  let review = {
    'user_id': faker.random.number(),
    'user_name': faker.name.findName(),
    'review_id': faker.random.number(),
    'user_avatar': faker.image.avatar(),
    'review_date': faker.date.past(),
    'review_content': faker.lorem.paragraph(),
  };
  reviews.push(review);
  console.log(JSON.stringify(review));
};

// {'rating_id': ,
//   'rating_type_name': ,
// 'average_star_rating': ,}

function randomBetween(a, b) {
  let range = Math.floor((b - a + 1) * Math.random());
  return a + range;
};

var ratings = {'accuracy': randomBetween(3, 5),
'location': randomBetween(3, 5),
'communication': randomBetween(3, 5),
'check-in': randomBetween(3, 5),
'cleanliness': randomBetween(3, 5),
'value': randomBetween(3, 5)};

console.log(JSON.stringify(ratings));

var listingRatings = {'total_review': 10,
'average_star_rating': ratings.value};


