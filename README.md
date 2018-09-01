# beachRNR-review-service

> Pithy project description

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)



## Public API for Beachrnr/Airbnb Mock Data

> *Review Content API (50-100 records per listing)*


- Url: http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/content
- Method: GET
- Params: roomID must be between 2912000 to 2012999
- Output Format: List of Objects
- Output Sample:
    ```
    [{"user_name":"Corine Roob",
     "user_avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/m_kalibry/128.jpg",
     "review_id":1,
     "review_time":"2018-08-22T00:00:00.000Z",
     "review_content":"Aut dolores consequuntur recusandae omnis nisi iusto enim. Illum dolorum dicta sit quidem et ut est. Distinctio suscipit dolorum ut.Et dolore ut aut illo culpa beatae nemo. Dolore et maiores odit facere corporis quas. Earum nostrum necessitatibus accusamus itaque fugiat officiis blanditiis omnis alias. Dicta sit minima omnis rerum quia id qui alias. Temporibus sit maiores modi distinctio quisquam repudiandae non impedit placeat. Animi non necessitatibus eos sit fuga nihil modi labore omnis."},
     {"user_name":"Thomas Harvey",
     "user_avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/we_social/128.jpg",
     "review_id":2,
     "review_time":"2018-08-22T00:00:00.000Z",
     "review_content":"Explicabo autem qui dolorem excepturi dolorem et aut libero. Similique aut rem. Voluptas eos nostrum odio. Ducimus et nemo libero.Autem quia voluptate minima sint ut. Voluptas libero eaque nesciunt consequatur. Sed sint reiciendis. Velit quam ab veniam saepe. Labore eos ipsam consequatur."
     }]
     ```

> *Review Content API (50-100 records per listing)*
- Url: http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/ratings
- Method: GET
- Params: roomID must be between 2912000 to 2012999
- Output Format: List of Objects
- Output Sample:
    ```
    [{"name":"Accuracy","average_star_rating":3.9},
    {"name":"Location","average_star_rating":4.1},
    {"name":"Communication","average_star_rating":4.2},
    {"name":"Checkin","average_star_rating":4},
    {"name":"Cleanliness","average_star_rating":3.8},
    {"name":"Value","average_star_rating":4.1}]
    ```


> *Review Content API (50-100 records per listing)*
- Url: http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/ratingnreviewcount
- Method: GET
- Params: roomID must be between 2912000 to 2012999
- Output Format: List of Objects
- Output Sample:
    ```
    {"review_count":73,
     "Average_rating":4}
    ```

## Example of Using Public API
![](img/review component.JPG).



## Public API for Beachrnr/Airbnb Mock Data

Review Content API (50-100 records per listing)

Method: GET
Url: http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/content
Params: roomID must be between 2912000 to 2012999
Output Format: List of Objects
Output Sample:
    [{"user_name":"Corine Roob",
     "user_avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/m_kalibry/128.jpg",
     "review_id":1,
     "review_time":"2018-08-22T00:00:00.000Z",
     "review_content":"Aut dolores consequuntur recusandae omnis nisi iusto enim. Illum dolorum dicta sit quidem et ut est. Distinctio suscipit dolorum ut.Et dolore ut aut illo culpa beatae nemo. Dolore et maiores odit facere corporis quas. Earum nostrum necessitatibus accusamus itaque fugiat officiis blanditiis omnis alias. Dicta sit minima omnis rerum quia id qui alias. Temporibus sit maiores modi distinctio quisquam repudiandae non impedit placeat. Animi non necessitatibus eos sit fuga nihil modi labore omnis."},
     {"user_name":"Thomas Harvey",
     "user_avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/we_social/128.jpg",
     "review_id":2,
     "review_time":"2018-08-22T00:00:00.000Z",
     "review_content":"Explicabo autem qui dolorem excepturi dolorem et aut libero. Similique aut rem. Voluptas eos nostrum odio. Ducimus et nemo libero.Autem quia voluptate minima sint ut. Voluptas libero eaque nesciunt consequatur. Sed sint reiciendis. Velit quam ab veniam saepe. Labore eos ipsam consequatur."
     }]

http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/ratings
Method: GET
Params: roomID must be between 2912000 to 2012999
Output Format: List of Objects
Output Sample:
    [{"name":"Accuracy","average_star_rating":3.9},
    {"name":"Location","average_star_rating":4.1},
    {"name":"Communication","average_star_rating":4.2},
    {"name":"Checkin","average_star_rating":4},
    {"name":"Cleanliness","average_star_rating":3.8},
    {"name":"Value","average_star_rating":4.1}]

http://ec2-54-67-103-194.us-west-1.compute.amazonaws.com/rooms/:roomID/reviews/ratingnreviewcount
Method: GET
Params: roomID must be between 2912000 to 2012999
Output Format: List of Objects
Output Sample:
    {"review_count":73,
     "Average_rating":4}

## Example of Using Public API


## Contributing


## Development

### Usage

<<<<<<< HEAD
npm install

=======
1. npm install
2. Make a copy of .sample-env file and save as '.env' in the same directory
3. Change the environment variable (env var) in your .env file, if your MYSQL_PASSWORD is empty string, please delete this env var from the .env

### Requirements

- Node 0.10.x
- MYSQL 5.7

### Contributing
>>>>>>> add README

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
