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
    rating_count INT(8) NOT NULL DEFAULT 0,
    average_rating DOUBLE NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
  );

  ALTER TABLE listing_review AUTO_INCREMENT = 2912000;

  CREATE TABLE IF NOT EXISTS review(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    review_content VARCHAR(1000) NOT NULL,
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id)
  );

  CREATE TABLE IF NOT EXISTS review_report(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    review_id BIGINT(8) UNSIGNED NOT NULL,
    report_content VARCHAR(1000) NOT NULL,
    report_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    FOREIGN KEY (rating_type_id) REFERENCES rating_type(id),
    CONSTRAINT unique_review_rating_type UNIQUE (review_id, rating_type_id)
  );

  CREATE TABLE IF NOT EXISTS listing_attribute_rating(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    rating_type_id INT(8) UNSIGNED NOT NULL,
    rating_review_count INT(8) UNSIGNED NOT NULL,
    average_star_rating TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id),
    FOREIGN KEY (rating_type_id) REFERENCES rating_type(id),
    CONSTRAINT unique_attr_rating UNIQUE (listing_review_id, rating_type_id)
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

module.exports.updateListingReviewCount = (list_review_id, cb) => {
  let q = `UPDATE listing_review SET review_count = review_count + 1 WHERE id = ?`;
  connection.query(q, [list_review_id], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
};

module.exports.createReview = (review, cb) => {
  let q = 'INSERT INTO review SET ?';
  connection.query(q, review, (err, results, fields) => {
      if(results) {
          err? cb(err, null, review) : cb(null, results, review);
        module.exports.updateListingReviewCount(review.listing_review_id, (err2, results2) => {

        });
      }
  })
};

module.exports.createReviews = (reviews, cb) => {
  reviews.forEach(review => {
    module.exports.createReview(review, cb);
  });
};

module.exports.createReviewReport = (reviewReps, cb) => {
  let q = 'INSERT INTO review_report SET ?';
  reviewReps.forEach((reviewRep => {
    connection.query(q, reviewRep, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};

module.exports.upsertListingAttrRating = (listing_review_id, rating_type_id, newRating, cb) => {
  let q = `INSERT INTO listing_attribute_rating (listing_review_id, rating_type_id, rating_review_count, average_star_rating)
        VALUES (?, ?, 1, ?)
        ON DUPLICATE KEY
        UPDATE
          average_star_rating = (average_star_rating * rating_review_count + ${newRating}) / (rating_review_count + 1),
          rating_review_count = rating_review_count + 1
`;
  connection.query(q, [listing_review_id, rating_type_id, newRating], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
};

module.exports.updateListingReviewAvRating = (list_review_id, newAvgRating, cb) => {
  let q = `UPDATE listing_review
           SET average_rating = (average_rating * rating_count + ?) / (rating_count + 1), rating_count = rating_count + 1
           WHERE id = ?
          `;
  connection.query(q, [newAvgRating, list_review_id], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
};

module.exports.createReviewRating = (reviewRating, listing_review_id, cb) => {
  let q = 'INSERT INTO review_rating SET ?';
  connection.query(q, reviewRating, (err, results, fields) => {
    if(results) {
      module.exports.upsertListingAttrRating(listing_review_id, reviewRating.rating_type_id, reviewRating.star_ratings, (err2, results2) => {
        if(results2) {
          module.exports.updateListingReviewAvRating(listing_review_id, reviewRating.star_ratings, (err3, results3) => {})
        }
      });
    }
  });
};

module.exports.createReviewRatings = (reviewRatings, listing_review_id, cb) => {
  reviewRatings.forEach(reviewRating => {module.exports.createReviewRating(reviewRating, listing_review_id, cb)});
};

module.exports.createRatingType = (ratingTypes, cb) => {
  let q = 'INSERT INTO rating_type SET ?';
  ratingTypes.forEach((ratingType => {
    connection.query(q, ratingType, (err, results, fields) => {
      err ? cb(err, null) : cb(null, results);
    })
  }));
};


module.exports.connection = connection;








