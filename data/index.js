var mysql  = require('mysql');
var dbkeys = require('../config.js');

var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST || dbkeys.host,
  user     : process.env.MYSQL_USER || dbkeys.user,
  password : process.env.MYSQL_PASSWORD || dbkeys.password,
  multipleStatements: true
});


connection.query(`
  CREATE DATABASE IF NOT EXISTS beachrnr;

  USE beachrnr;

  CREATE TABLE IF NOT EXISTS user(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS listing_review(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    review_count INT(8) NOT NULL DEFAULT 0,
    average_rating INT(8) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
  );

  ALTER TABLE listing_review AUTO_INCREMENT = 2912000;

  CREATE TABLE IF NOT EXISTS review(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    review_content VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id)
  );

  CREATE TABLE IF NOT EXISTS review_report(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    review_id BIGINT(8) UNSIGNED NOT NULL,
    report_content VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (review_id) REFERENCES review(id),
    CONSTRAINT unique_report UNIQUE (user_id, review_id)
  );

  CREATE TABLE IF NOT EXISTS rating_type(
    id INT(8) UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS review_rating(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    review_id BIGINT(8) UNSIGNED NOT NULL,
    rating_type_id INT(8) UNSIGNED NOT NULL,
    star_ratings TINYINT(1) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (review_id) REFERENCES review(id),
    FOREIGN KEY (rating_type_id) REFERENCES rating_type(id)
  );

  CREATE TABLE IF NOT EXISTS listing_attribute_rating(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    rating_type_id INT(8) UNSIGNED NOT NULL,
    rating_review_count INT(8) UNSIGNED NOT NULL,
    average_star_rating TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id),
    FOREIGN KEY (rating_type_id) REFERENCES rating_type(id)
  );

`);


module.exports.createUser = (users, cb) => {
  let q = 'INSERT INTO user SET ?';
  users.forEach((user => {
    connection.query(q, user, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

module.exports.createListing = (listingIDs, cb) => {
  let q = 'INSERT INTO listing_review SET ?';
  listingIDs.forEach((listing => {
    connection.query(q, listing, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

// module.exports.updateListingRevCount = (listingID, cb) => {
//   let q = 'UPDATE listing_review SET ?';
//   connection.query(q, listing, (err, results, fields) => {
//       err ? cb(err, null) : cb(null, results);
//   })
// };

module.exports.createReview = (reviews, cb) => {
  let q = 'INSERT INTO review SET ?';
  reviews.forEach((review => {
    connection.query(q, review, (err, results, fields) => {
      if(results) {
      let q2 = 'UPDATE listing_review SET review_count = review_count + 1';
      connection.query(q2, [], (err2, results2, fields2) => {err2 ? cb(err2, null) : cb(null, results2)});}
    })
  }));
};

module.exports.createReviewReport = (reviewReps, cb) => {
  let q = 'INSERT INTO review_report SET ?';
  reviewReps.forEach((reviewRep => {
    connection.query(q, reviewRep, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

module.exports.createReviewRating = (reviewRatings, cb) => {
  let q = 'INSERT INTO review_rating SET ?';
  reviewRatings.forEach((reviewRating => {
    connection.query(q, reviewRating, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

module.exports.createRatingType = (ratingTypes, cb) => {
  let q = 'INSERT INTO rating_type SET ?';
  ratingTypes.forEach((ratingType => {
    connection.query(q, ratingType, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

module.exports.createListingAttrRating = (listAttrRatings, cb) => {
  let q = 'INSERT INTO listing_attribute_rating SET ?';
  listAttrRatings.forEach((listAttrRating => {
    connection.query(q, listAttrRating, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};


module.exports.connection = connection;








