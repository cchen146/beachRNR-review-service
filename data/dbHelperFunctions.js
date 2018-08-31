const {connection} = require('./index.js');

let currentDB = `${process.env.NODE_ENV === 'test'
                ? 'beachrnrtesting'
                : 'beachrnr'}`;


let query = `
  CREATE DATABASE IF NOT EXISTS ${currentDB};

  USE ${currentDB};

  CREATE TABLE IF NOT EXISTS user(
    id BIGINT(8) UNSIGNED,
    name VARCHAR(200) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS listing_review(
    id BIGINT(8) UNSIGNED,
    review_count INT(8) NOT NULL DEFAULT 0,
    rating_count INT(8) NOT NULL DEFAULT 0,
    average_rating DOUBLE NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS review(
    id BIGINT(8) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    review_content VARCHAR(1000) NOT NULL,
    review_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id)
  );


  CREATE TABLE IF NOT EXISTS review_report(
    id BIGINT(8) UNSIGNED,
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
    id INT(8) UNSIGNED,
    name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS review_rating(
    id BIGINT(8) UNSIGNED,
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
    rating_review_count INT(8) UNSIGNED NOT NULL DEFAULT 0,
    average_star_rating DOUBLE NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (listing_review_id) REFERENCES listing_review (id),
    FOREIGN KEY (rating_type_id) REFERENCES rating_type(id),
    CONSTRAINT unique_attr_rating UNIQUE (listing_review_id, rating_type_id)
  );

`

module.exports.setupDatabase = (cb) => {
  connection.query(query, [], (err, results, fields) => {
    err? cb(err, null) : cb (null, results);
  })
};


module.exports.setupDatabase(()=> {});

module.exports.dropTestingDatabase = (cb) => {
  let q = `DROP DATABASE IF EXISTS beachrnrtesting`;
  connection.query(q, [], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
}

module.exports.dropDatabase = (cb) => {
  let q = `DROP DATABASE IF EXISTS beachrnr`;
  connection.query(q, [], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
}

module.exports.createUser = (user, cb, counter) => {
  let q = 'INSERT INTO user SET ?';
  connection.query(q, user, (err, results, fields) => {
    err ? cb(err, null, counter) : cb(null, results, counter);
  });
};

module.exports.createListing = (listing, cb, counter) => {
  let q = 'INSERT INTO listing_review SET ?';
  connection.query(q, listing, (err, results, fields) => {
    err ? cb(err, null, counter) : cb(null, results, counter);
  })
};

module.exports.updateListingReviewCount = (list_review_id, cb) => {
  let q = `UPDATE listing_review SET review_count = review_count + 1 WHERE id = ?`;
  connection.query(q, [list_review_id], (err, results, fields) => {
    err ? cb(err, null) : cb(null, results);
  });
};

module.exports.createReview = (review, cb, counter) => {
  let q = 'INSERT INTO review SET ?';
  connection.query(q, review, (err, results, fields) => {
      if(err) {cb(err, null, review)};
      if(results) {
          cb(null, results, review, counter);
          module.exports.updateListingReviewCount(review.listing_review_id, (err2, results2) => {
        });
      }
  })
};

module.exports.createReviewReport = (reviewRp, cb, counter) => {
  let q = 'INSERT INTO review_report SET ?';
    connection.query(q, reviewRp, (err, results, fields) => {
      err ? cb(err, null, counter) : cb(null, results, counter);
    })
};

module.exports.createReviewRating = (reviewRating, listing_review_id, cb, counter) => {
  let q = `INSERT INTO review_rating SET ?;
          INSERT INTO listing_attribute_rating (listing_review_id, rating_type_id, rating_review_count, average_star_rating)
          VALUES (?, ?, 1, ?)
          ON DUPLICATE KEY
          UPDATE
            average_star_rating = (average_star_rating * rating_review_count + ?) / (rating_review_count + 1),
            rating_review_count = rating_review_count + 1;

          UPDATE listing_review
           SET
             average_rating = (average_rating * rating_count +
                                      (SELECT average_star_rating
                                        FROM listing_attribute_rating
                                        WHERE listing_review_id = ?
                                          AND rating_type_id = ?)
                              ) / (rating_count + 1),
             rating_count = rating_count + 1
           WHERE id = ?;
        `;
  const options = [reviewRating,
                   listing_review_id, reviewRating.rating_type_id, reviewRating.star_ratings,
                   reviewRating.star_ratings,
                   listing_review_id,
                   reviewRating.rating_type_id,
                   listing_review_id
                  ];

  connection.query(q, options, (err, results, fields) => {
                        err ? cb(err, null, counter) : cb(null, results, counter);
                  });
};


module.exports.createRatingType = (ratingType, cb, counter) => {
  let q = 'INSERT INTO rating_type SET ?';
  connection.query(q, ratingType, (err, results, fields) => {
    err ? cb(err, null, counter) : cb(null, results,counter);
  })
};

module.exports.readRatingNReviewCount = (listingId, cb) => {

  let q = `SELECT review_count, ROUND(average_rating, 1) AS average_rating
            FROM listing_review
            WHERE id = ?`;

  connection.query(q, [listingId], (err, results, fields) => {

    err? cb(err, null) : cb(null, results);
  });
};

module.exports.readReviewContent = (listingId, cb) => {
  let q = `SELECT U.name AS user_name, U.avatar AS user_avatar, R.id AS review_id, R.review_time AS review_time, R.review_content AS review_content
          FROM review AS R
          LEFT JOIN user AS U
          ON R.user_id = U.id
          WHERE listing_review_id = ?
          ORDER BY R.review_time DESC`;

  connection.query(q, [listingId], (err, results, fields) => {
    err? cb(err, null) : cb(null, results);
  });
};

module.exports.readReviewRatings = (listingId, cb) => {
  let q = `SELECT RT.name, ROUND(average_star_rating, 1) AS average_star_rating
            FROM listing_attribute_rating AS LAR
            LEFT JOIN rating_type AS RT
            ON LAR.rating_type_id = RT.id
            WHERE LAR.listing_review_id = ?
            ORDER BY RT.id`;
  connection.query(q, [listingId], (err, results, fields) => {
    err? cb(err, null) : cb(null, results);
  });
}

module.exports.updateReviewCount = (cb) => {
  let q = `UPDATE listing_review
            INNER JOIN (SELECT listing_review_id, count(*) AS review_count
                FROM review GROUP BY listing_review_id
              ) AS listing_review_count
            ON listing_review.id = listing_review_count.listing_review_id
            SET listing_review.review_count = listing_review_count.review_count
          `;
  connection.query(q, [], (err, results, fields) => {
    err? cb(err, null) : cb(null, results);
  });
}

module.exports.updateListingRatings = (cb) => {
  let q = `UPDATE listing_review
            INNER JOIN (
                  SELECT R.listing_review_id, sum(RRS.rating_count) AS rating_count, avg(RRS.avg_star_ratings)  AS avg_star_ratings
                  FROM review AS R
                  INNER JOIN 
                    (SELECT review_id, count(id) AS rating_count, avg(star_ratings) AS avg_star_ratings
                    FROM review_rating
                    GROUP BY review_id) AS RRS
                  ON R.id = RRS.review_id
                  GROUP BY R.listing_review_id
                  ) AS LRS
            ON listing_review.id = LRS.listing_review_id
            SET listing_review.rating_count = LRS.rating_count, listing_review.average_rating = LRS.avg_star_ratings
          `;
    connection.query(q, [], (err, results, fields) => {
      err? cb(err, null) : cb(null, results);
    });    
}

module.exports.updateListingAttrRatings = (cb) => {
  let q = `INSERT INTO listing_attribute_rating
            (listing_review_id, rating_type_id, rating_review_count, average_star_rating)
            SELECT * FROM
              (SELECT R.listing_review_id, RR.rating_type_id, count(RR.review_id) AS rating_review_count, avg(RR.star_ratings) AS average_star_rating
              FROM review AS R
              INNER JOIN
                (SELECT * FROM review_rating) AS RR
              ON R.id = RR.review_id
              GROUP BY R.listing_review_id, RR.rating_type_id) AS NLAR
            ON DUPLICATE KEY UPDATE 
              rating_review_count = NLAR. rating_review_count, 
                average_star_rating = NLAR.average_star_rating;
          `;
    connection.query(q, [], (err, results, fields) => {
      err? cb(err, null) : cb(null, results);
    });    
}