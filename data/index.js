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
    id BIGINT(8) NOT NULL UNSIGNED AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS listing_review(
    id BIGINT(8) NOT NULL UNSIGNED AUTO_INCREMENT,
    review_count INT(8) NOT NULL DEFAULT 0,
    average_rating INT(8) NOT NULL DEFAULT 0
  );

  ALTER TABLE listing_review AUTO_INCREMENT = 2912000;

  CREATE TABLE IF NOT EXISTS review(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    listing_review_id BIGINT(8) UNSIGNED NOT NULL,
    review_content VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (listing_review_id) REFERENCE listing_review (id)
  );

  CREATE TABLE IF NOT EXISTS review_report(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    user_id BIGINT(8) UNSIGNED NOT NULL,
    review_id BIGINT(8) UNSIGNED NOT NULL,
    report_content VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (review_id) REFERENCE review(id)
  );

  CREATE TABLE IF NOT EXISTS rating_type(
    id INT(8) UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE IF NOT EXISTS review_rating(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    review_id BIGINT(8) UNSIGNED NOT NULL,
    rating_type_id BIGINT(8) UNSIGNED NOT NULL,
    star_ratings TINYINT(1) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (review_id) REFERENCE review(id),
    FOREIGN KEY (rating_type_id) REFERENCE rating_type(id)
  );

  CREATE TABLE IF NOT EXISTS listing_attribute_rating(
    id BIGINT(8) UNSIGNED AUTO_INCREMENT,
    listing_review_id INT(8) UNSIGNED NOT NULL,
    rating_type_id BIGINT(8) UNSIGNED NOT NULL,
    average_star_rating TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (listing_review_id) REFERENCE listing_review (id),
    FOREIGN KEY (rating_type_id) REFERENCE rating_type(id)
  );


`);


connection.end();

module.exports.connection = connection;