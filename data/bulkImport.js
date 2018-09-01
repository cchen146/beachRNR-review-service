const db = require('./index.js');
const glob = require("glob")

const findFiles = filePattern => {
    return new Promise((resolve,reject) => {
        glob(filePattern, (err, files) => {
            err? reject(err) : resolve(files)
        });
    });
};

const load2MySQL = (loadQuery, file) => {
    return new Promise((resolve,reject) => {
        db.connection.query(loadQuery, file, (err, results, fields) => {
            err? reject(err) : resolve(results)
        });
    });
};

const loadFiles2MySQL = async (filePattern, loadQuery) => {
    const files = await findFiles(filePattern);
    var start = new Date();
    var stop;
    for(let file of files) {
        stop = new Date();
        let results = await load2MySQL(loadQuery, file);
        console.log('file: ' + file);
        console.log('message: ' + results.message);
        console.log('taking- ' + (stop - start)/1000 + 's');
    }
};


const getLoadSQL = (tableName, columnNames) => {
    return `
        LOAD DATA LOCAL INFILE ? INTO TABLE ${tableName} 
        FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' 
        LINES TERMINATED BY '\r\n'
        (${columnNames.join(',')})
    `;
};

const runLoadFiles = async () => {
    await loadFiles2MySQL(__dirname + `/mockData/users/*.csv`, getLoadSQL('user', ['id', 'name', 'avatar']));
    await loadFiles2MySQL(__dirname + `/mockData/ratingTypes/*.csv`, getLoadSQL('rating_type', ['id','name']));
    await loadFiles2MySQL(__dirname + `/mockData/listings/*.csv`, getLoadSQL('listing_review', ['id', 'review_count', 'rating_count', 'average_rating']));
    await loadFiles2MySQL(__dirname + `/mockData/reviews/*.csv`, getLoadSQL('review', ['id','user_id', 'listing_review_id', 'review_content', 'review_time']));
    await loadFiles2MySQL(__dirname + `/mockData/ratings/*.csv`, getLoadSQL('review_rating', ['id','review_id', 'rating_type_id', 'star_ratings']));
    await loadFiles2MySQL(__dirname + `/mockData/reports/*.csv`, getLoadSQL('review_report', ['id','user_id','review_id','report_content', 'report_time']));
};
   
db.connection.query('USE beachrnr', [], (err, results, fields)=>{
    runLoadFiles();
});
module.exports.runLoadFiles = runLoadFiles; 

