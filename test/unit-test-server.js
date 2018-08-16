process.env.NODE_ENV = 'test';
const app = require('../server/index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const assert = require('assert');
chai.use(chaiHttp);

describe('Test server REST API', () => {

	describe('/rooms/:id/reviews/ratings', () => {
		var cb;

		before(() => {
			cb = sinon.fake();
			console.log('cb >>>' + cb);
			app.ratingsHandler.get(cb);
			app.runServer();
		})

		after(() => {
			sinon.restore();
			app.server.close();
		});

		it('cb is called once', (done) => {
			chai.request(app.app)
		        .get('/rooms/2912000/reviews/ratings')
		        .end((err, res) => {
		       		assert(cb.called);
		    		done();
		        })
		});

		xit('cb is called with id params', () => {

		})

	});

})
