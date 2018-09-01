const {deleteDirFilesUsingPattern} = require('../utils/dataGeneration.js');
const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const csvStringify = require('csv-stringify/lib/sync');
moment().format();

let start = new Date();
let options = {'rowDelimiter': 'windows',
                'quotedString': true 
              };
var user_id;
const generateFakeUserData = (num_of_records) => {
    let data = [];
    for(let i = 1; i <= num_of_records; i++) {
        user_id++;
        data.push([user_id, faker.name.findName(), faker.image.avatar()]);
    }
    return csvStringify(data, options);
};

var listing_id;
const generateFakeListingData = (num_of_records) => {
    let data = [];
    for(let i = 1; i <= num_of_records; i++) {
        listing_id++;
        data.push([listing_id, 0, 0, 0]);
    }
    return csvStringify(data, options);
};


const generateRatingTypeData = () => {
    let data = [[1, 'Accuracy'],
                [2, 'Location'],
                [3, 'Communication'],
                [4, 'Checkin'],
                [5, 'Cleanliness'],
                [6, 'Value']
               ];
     return csvStringify(data, options);
};

var review_id;
const generateFakeReviewData = (listing_start, listing_end) => {
    let data = [];
    for(let listing_review_id = listing_start; listing_review_id < listing_end; listing_review_id++) {
        let numOfReviews = Math.floor(Math.random()*50) + 50;
        for (let i = 1; i <= numOfReviews; i++) {
            review_id++;
            data.push([review_id, 
                      Math.floor(Math.random()*(listing_end-listing_start)) + 1, 
                      listing_review_id, 
                      faker.lorem.paragraph() + faker.lorem.paragraph(), 
                      moment().subtract(10, 'days').format('YYYY-MM-DD')
                    ]);
        }
    }
    return reviews = {
        'data': csvStringify(data, options),
        'count' : data.length
    };
};


var rating_id;
const generateFakeReviewRatingData = (start_review, end_review) => {
    let data = [];
    
    for(let review_id = start_review; review_id < end_review; review_id++) {
        for (let rating_type_id = 1; rating_type_id <= 6; rating_type_id++) {
            rating_id++;
            data.push([rating_id, review_id,  rating_type_id, Math.floor(Math.random() * 3) + 3]);
        }
    }
    return csvStringify(data, options);
};

var report_id;
const generateFakeReportData = (numOfReports, reviewStart, reviewEnd, listingStart, listingEnd) => {
    let data = [];
    let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
                            `This review is purposefully malicious and assaulting.`,
                            `This review contains false information or may be fake.`
                        ];
                    
    for(let i = 1; i <= numOfReports; i++) {
        report_id++;
        data.push([report_id, 
                   Math.floor(Math.random()*(listingEnd - listingStart) + listingStart - 2911999),
                   Math.floor(Math.random()*(reviewEnd - reviewStart)) + reviewStart,
                   reportOptions[Math.floor(Math.random()*3)], 
                   moment().subtract(Math.floor(Math.random()*10), 'days').format('YYYY-MM-DD')
                 ]);       
    }
    return csvStringify(data, options);
};


const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
            err? reject(err) : resolve('done');
        })
    })
}


const generateMassMockData = async (numOfChunks, chunkSize) => {

    await deleteDirFilesUsingPattern('*/*', __dirname + '/mockData/');

    listing_id = 2912000-1;
    rating_id = 0;
    review_id = 0;
    user_id = 0;
    report_id = 0;

    const ratingTypes = generateRatingTypeData();
    await writeFile(`${__dirname}/mockData/ratingTypes/ratingTypes.csv`, ratingTypes)
    console.log(`${__dirname}/mockData/ratingTypes/ratingTypes.csv`);
    console.log('ratingTypes data written to files: ' + (new Date() - start)/1000 + 's'); 

    for (let chunk = 1; chunk <= numOfChunks; chunk++) {
                
        const users = generateFakeUserData(chunkSize);
        await writeFile(`${__dirname}/mockData/users/users - ${numOfChunks} - ${chunk}.csv`, users)
        console.log(`${__dirname}/mockData/users/users - ${numOfChunks}- ${chunk}.csv`);
        console.log('users data written to files: ' + (new Date() - start)/1000 + 's'); 

        const listings = generateFakeListingData(chunkSize);
        await writeFile(`${__dirname}/mockData/listings/listings - ${numOfChunks} - ${chunk}.csv`, listings)
        console.log(`${__dirname}/mockData/listings/listings - ${numOfChunks}- ${chunk}.csv`);
        console.log('listings data written to files: ' + (new Date() - start)/1000 + 's'); 

        const reviews = generateFakeReviewData(listing_id - chunkSize + 1, listing_id + 1);
        await writeFile(`${__dirname}/mockData/reviews/reviews-${numOfChunks}-${chunk}.csv`, reviews.data)
        console.log(`${__dirname}/mockData/reviews/reviews-${numOfChunks}-${chunk}.csv`);
        console.log('reviewRatings data written to files: ' + (new Date() - start)/1000 + 's'); 
        
        const count = reviews.count;
        const reviewRatings = generateFakeReviewRatingData(review_id - count + 1, review_id + 1);
        await writeFile(`${__dirname}/mockData/ratings/ratings-${numOfChunks}-${chunk}.csv`, reviewRatings)
        console.log(`${__dirname}/mockData/ratings/ratings-${numOfChunks}-${chunk}.csv`);
        console.log('reviewsdata written to files: ' + (new Date() - start)/1000 + 's'); 

        const reports = generateFakeReportData(chunkSize, review_id - count + 1, review_id + 1, listing_id - chunkSize + 1, listing_id + 1);
        await writeFile(`${__dirname}/mockData/reports/reports-${numOfChunks}-${chunk}.csv`, reports)
        console.log(`${__dirname}/mockData/reports/reports-${numOfChunks}-${chunk}.csv`);
        console.log('reports written to files: ' + (new Date() - start)/1000 + 's'); 

        // global.gc();
        console.log('memory: ' + process.memoryUsage().heapUsed);
    }


}


// generateMassMockData(1, 1000);





// const generateBychunks = (filePath, label, chunkSize, totalRecords, inputClass) => {
//     let counter = 0;
//     for(let t = 1; t <= totalRecords/chunkSize; t++) {
//         let temp = [];
//         for(let i = 1; i <= chunkSize; i++) {
//             counter++; 
//             let obj = new inputClass(counter);
//             temp.push(obj);
//         }
//         stop = new Date();
//         console.log('data generation for ' + label + 'chunk ' + t + ' taking ' + (stop - start)/1000 + 's'); 
//         writeCsv(filePath, `${label}-${totalRecords/chunkSize}-${t}`, 'csv', temp, (err, results) => {
//                stop = new Date();
//             console.log(`${filePath}/${label}-${totalRecords/chunkSize}-${t}.csv is written taking - ${(stop - start) / 1000}s`);
//         });
//     }
// }


// const generateMockData = (mockSize, chunk) => {

//     let numOfChunks = mockSize / chunk;
    
//     // generates users
//     let User = class User {
//         constructor(i) {
//             this.id = i;
//             this.name = faker.name.findName();
//             this.avatar = faker.image.avatar();
//           }
//     }
//     generateBychunks(__dirname + '/mockData/users', 'users', mockSize, mockSize, User);
    
//     // generate listings
//     let Listings = class Listings {
//         constructor(i) {
//             this.id = i+2912000-1;
//             this.review_count = 0;
//             this.average_rating = 0;
//           }
//     }
//     generateBychunks(__dirname + '/mockData/listings', 'listings', mockSize, mockSize, Listings);
    
//     // generate rating Types
//     let ratingTypes = [ {'id': 1, 'name': 'Accuracy'},
//                         {'id': 2, 'name': 'Location'},
//                         {'id': 3, 'name': 'Communication'},
//                         {'id': 4, 'name': 'Checkin'},
//                         {'id': 5, 'name': 'Cleanliness'},
//                         {'id': 6, 'name': 'Value'}
//                       ];
//     writeCsv(__dirname + '/mockData/ratingTypes', `ratingTypes`, 'csv', ratingTypes, () => {
//         stop = new Date();
//         console.log(`${__dirname}/mockData/ratingTypes/ratingTypes is written taking - ${(stop - start) / 1000}s`);
//     });

    
//     // generate 50 - 100 reviews for each listing
    
//     let reviewCounter = 0;
//     let listingId = 2912000 - 1;
//     for(let t = 1; t <= mockSize/chunk; t++) {
//         let temp = [];
//         for(let c = 1; c <= chunk; c++) {
//             let reviewCount = Math.floor(Math.random()*50) + 50;
//             listingId++;
//             for(let i = 0; i < reviewCount; i++) {
//                 reviewCounter++;
//                 let r = {'id': reviewCounter,
//                         'user_id': Math.floor(Math.random()*mockSize) + 1,
//                         'listing_review_id': listingId,
//                         'review_content': faker.lorem.paragraph() + faker.lorem.paragraph(),
//                         'review_time': moment().subtract(10, 'days').format('YYYY-MM-DD')
//                     };
//                 temp.push(r);
                
//             }    
//         }
//         stop = new Date();
//         console.log('data generation for reviews chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
//         writeCsv(__dirname + '/mockData/reviews', `reviews-${mockSize/chunk}-${t}`, 'csv', temp, () => {
//             stop = new Date();
//             console.log(`${__dirname}/mockData/reviews/reviews-${mockSize/chunk}-${t} is written taking - ${(stop - start) / 1000}s`);
//         });

//     }
    
//     // generate 6 ratings per review
//     let reviewId = 0;
//     let ratingCounter = 0;
//     for(let t = 1; t <= numOfChunks; t++) {
//         let temp = [];
//         for(let i = 1; i <= reviewCounter/numOfChunks; i++) {
//             reviewId++;
//             for(let j = 0; j < ratingTypes.length; j++) {
//                 ratingCounter++;
//                 let reviewRating = {
//                         id: ratingCounter,
//                         review_id: reviewId,
//                         rating_type_id: j + 1,
//                         star_ratings: Math.floor(Math.random() * 3) + 3
//                      };
//                 temp.push(reviewRating);
//             }
//         }
        
//         stop = new Date();
//         console.log('data generation for ratings chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
//         writeCsv(__dirname + '/mockData/ratings', `ratings-${numOfChunks}-${t}`, 'csv', temp, ()=>{
//             stop = new Date();
//             console.log(`${__dirname}/mockData/ratings/ratings-${numOfChunks}-${t} is written taking - ${(stop - start) / 1000}s`);
//         });

//     }
    
// //     // generate number of reports for any review;
// //     let reportOptions = [`This review contains violent, graphic, promotional, or otherwise offensive content.`,
// //     `This review is purposefully malicious and assaulting.`,
// //     `This review contains false information or may be fake.`
// //     ];
    
// //     let reportCounter = 0;
// //     for(let t = 1; t <= numOfChunks; t++) {
// //         let temp = [];
// //         for(let i = 1; i <= mockSize/numOfChunks; i++) {
// //             reportCounter++;
// //             let review_id = Math.floor(Math.random()*reviewCounter) + 1;
// //             let report = {'id': reportCounter,
// //                         'user_id': i,
// //                         'review_id': review_id,
// //                         'report_time': moment().subtract(10, 'days').format('YYYY-MM-DD'),
// //                         'report_content': reportOptions[Math.floor(Math.random()*3)]};
// //             temp.push(report);
// //         }
// //         stop = new Date();
// //         console.log('data generation for reports chunck' + t + ' taking ' + (stop - start)/1000 + 's'); 
// //         writeCsv(__dirname + '/mockData/reports', `reports-${numOfChunks}-${t}`, 'csv', temp, ()=> {
            
// //             stop = new Date();
// //             console.log(`${__dirname}/mockData/reports/reports-${numOfChunks}-${t} is written taking - ${(stop - start) / 1000}s`);
// //         });
// //     }

// }
    
// deleteDirFilesUsingPattern('*/*', __dirname + '/mockData/').then(() => {
//     generateMockData(20000, 50);
// });

module.exports.generateMassMockData = generateMassMockData;
