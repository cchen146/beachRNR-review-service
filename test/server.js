const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
const db = require('../data/index.js');


describe('TESTING API GET REQUEST', () => {

	var app; 
	before((done) => { //Before each test we empty the database
		db.dropTestingDatabase((err, res, fields) => {
			db.setupDatabase();
			app = require('../server/index.js');
			done();
		});
	});

	after((done) => {
		app.server.close();
		db.connection.end();
		done();
	});


  describe('/rooms/:id/reviews/content', function() {
    it('should respond to GET REQUEST with an array', function(done) {
	    chai.request(app.app)
	        .get('/rooms/2912000/reviews/content')
	        .end((err, res) => {
	            res.should.have.status(200);
	            res.body.should.be.a('array');
	            res.body.length.should.be.eql(0);
	          done();
	        });
    });
  });

   describe('/rooms/:id/reviews/ratingnreviewcount', function() {
    it('should respond to GET REQUEST with an array', function(done) {
	    chai.request(app.app)
	        .get('/rooms/2912000/reviews/ratingnreviewcount')
	        .end((err, res) => {
	            res.should.have.status(200);
	            res.body.should.be.a('object');
	          done();
	        });
    });
  });

   describe('/rooms/:id/reviews/ratings', function() {
    it('should respond to GET REQUEST with an array', function(done) {
	    chai.request(app.app)
	        .get('/rooms/2912000/reviews/ratings')
	        .end((err, res) => {
	            res.should.have.status(200);
	            res.body.should.be.a('array');
	            res.body.length.should.be.eql(0);
	          	done();
	        });
    });
  });


   describe('/rooms/:id/reviews/INVALID', function() {
    it('should respond with status 404 to GET REQUEST to invalid url', function(done) {
	    chai.request(app.app)
	        .get('/rooms/2912000/reviews/INVALID')
	        .end((err, res) => {
	        	res.should.have.status(404);
	        	done();
	        });
    });
  });
});
