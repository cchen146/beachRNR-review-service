const {writeCsv} = require('../utils/dataGeneration.js');
const faker = require('faker');
const moment = require('moment');
moment().format();

let start = new Date();
let stop;

const generateBychunks = (filePath, label, chunkSize, totalRecords, inputClass) => {
    let counter = 0;
    for(let t = 1; t <= totalRecords/chunkSize; t++) {
        let temp = [];
        for(let i = 1; i <= chunkSize; i++) {
            counter++; 
            let obj = new inputClass(counter);
            temp.push(obj);
        }
        stop = new Date();
        console.log('data generation for ' + label + 'chunk ' + t + ' taking ' + (stop - start)/1000 + 's'); 
        writeCsv(filePath, `${label}-${totalRecords/chunkSize}-${t}`, 'csv', temp, (err, results) => {
               stop = new Date();
            console.log(`${filePath}/${label}-${totalRecords/chunkSize}-${t}.csv is written taking - ${(stop - start) / 1000}s`);
        });
    }
}


const generateMockData = (mockSize, chunk) => {

    let numOfChunks = mockSize / chunk;
    
    // generates users
    let User = class User {
        constructor(i) {
            this.id = i;
            this.name = faker.name.findName();
            this.avatar = faker.image.avatar();
          }
    }
    generateBychunks(__dirname + '/mockData/users', 'users', mockSize, mockSize, User);
    
    // generate listings
    let Listings = class Listings {
        constructor(i) {
            this.id = i+2912000-1;
            this.review_count = 0;
            this.average_rating = 0;
          }
    }
    generateBychunks(__dirname + '/mockData/listings', 'listings', mockSize, mockSize, Listings);
    
    // generate rating Types
    let ratingTypes = [ {'id': 1, 'name': 'Accuracy'},
                        {'id': 2, 'name': 'Location'},
                        {'id': 3, 'name': 'Communication'},
                        {'id': 4, 'name': 'Checkin'},
                        {'id': 5, 'name': 'Cleanliness'},
                        {'id': 6, 'name': 'Value'}
                      ];
    writeCsv(__dirname + '/mockData/ratingTypes', `ratingTypes`, 'csv', ratingTypes, () => {
        stop = new Date();
        console.log(`${__dirname}/mockData/ratingTypes/ratingTypes is written taking - ${(stop - start) / 1000}s`);
    });

    
    // generate 50 - 100 reviews for each listing
    
    let reviewCounter = 0;
    let listingId = 2912000 - 1;
    for(let t = 1; t <= mockSize/chunk; t++) {
        let temp = [];
        for(let c = 1; c <= chunk; c++) {
            let reviewCount = Math.floor(Math.random()*50) + 50;
            listingId++;
            for(let i = 0; i < reviewCount; i++) {
                reviewCounter++;
                let r = {'id': reviewCounter,
                        'user_id': Math.floor(Math.random()*mockSize) + 1,
                        'listing_review_id': listingId,
                        'review_content': faker.lorem.paragraph() + faker.lorem.paragraph(),
                        'review_time': moment().subtract(10, 'days').format('YYYY-MM-DD')
                    };
                temp.push(r);
                
            }    
        }
        stop = new Date();
        console.log('data generation for reviews chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
        writeCsv(__dirname + '/mockData/reviews', `reviews-${mockSize/chunk}-${t}`, 'csv', temp, () => {
            stop = new Date();
            console.log(`${__dirname}/mockData/reviews/reviews-${mockSize/chunk}-${t} is written taking - ${(stop - start) / 1000}s`);
        });

    }
    
    // generate 6 ratings per review
    let reviewId = 0;
    let ratingCounter = 0;
    for(let t = 1; t <= numOfChunks; t++) {
        let temp = [];
        for(let i = 1; i <= reviewCounter/numOfChunks; i++) {
            reviewId++;
            for(let j = 0; j < ratingTypes.length; j++) {
                ratingCounter++;
                let reviewRating = {
                        id: ratingCounter,
                        review_id: reviewId,
                        rating_type_id: j + 1,
                        star_ratings: Math.floor(Math.random() * 3) + 3
                     };
                temp.push(reviewRating);
            }
        }
        
        stop = new Date();
        console.log('data generation for ratings chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
        writeCsv(__dirname + '/mockData/ratings', `ratings-${numOfChunks}-${t}`, 'csv', temp, ()=>{
            stop = new Date();
            console.log(`${__dirname}/mockData/ratings/ratings-${numOfChunks}-${t} is written taking - ${(stop - start) / 1000}s`);
        });

    }
    
    // generate number of reports for any review;
    let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
    `This review is purposefully malicious and assaulting.`,
    `This review contains false information or may be fake.`
    ];
    
    let reportCounter = 0;
    for(let t = 1; t <= numOfChunks; t++) {
        let temp = [];
        for(let i = 1; i <= mockSize/numOfChunks; i++) {
            reportCounter++;
            let review_id = Math.floor(Math.random()*reviewCounter) + 1;
            let report = {'id': reportCounter,
                        'user_id': i,
                        'review_id': review_id,
                        'report_time': moment().subtract(10, 'days').format('YYYY-MM-DD'),
                        'report_content': reportOptions[Math.floor(Math.random()*3)]};
            temp.push(report);
        }
        stop = new Date();
        console.log('data generation for reports chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
        writeCsv(__dirname + '/mockData/reports', `reports-${numOfChunks}-${t}`, 'csv', temp, ()=> {
            
            stop = new Date();
            console.log(`${__dirname}/mockData/reports/reports-${numOfChunks}-${t} is written taking - ${(stop - start) / 1000}s`);
        });
    }

}
    
// deleteDirFilesUsingPattern('*/*', __dirname + '/mockData/').then(() => {
//     generateMockData(1000, 50);
// });

module.exports.generateMockData = generateMockData;
