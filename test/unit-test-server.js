process.env.NODE_ENV = 'test';
const app = require('../server/index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const assert = require('assert');
chai.use(chaiHttp);

xdescribe('Test server REST API', () => {

	xdescribe('/rooms/:id/reviews/ratings', () => {
		var cb;

		before(() => {
			cb = sinon.fake();
			app.ratingsHandler.get(cb);
			app.runServer();
		})

		after(() => {
			sinon.restore();
			app.server.close();
		});

		xit('cb is called once', (done) => {
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
