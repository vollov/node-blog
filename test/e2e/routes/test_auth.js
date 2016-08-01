var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
var _ = require('underscore');

var cfg = require('../../../config.js');
var log = require('../../../lib/test_logger');

require('../../../models/Users');
var User = mongoose.model('User');


describe('Authentication module', function() {
	var url = cfg.test.url;
	var token;
	
	after(function(done){
		log.debug('clean up registration test');
		
		mongoose.connect('mongodb://localhost/'+ cfg.db.name);
		
		User.remove({username: 'anna'},function(err, status) {
			log.debug('user anna delete err=%j, status=%j', err, status);
			if (err) {
				log.error('auth clean up err=%j', err);
				done();
			}
			if (!status) {
				log.error('cannot find user in auth clean up.');
				done();
			}
			
			log.debug('user anna deleted in clean up');
			
			mongoose.connection.close(function(err) {
				if (err) {
					log.error('Authentication module after() close db err=%j',
							err);
				}
				done();
			});
		});

		
		//done();
	});
	
	
	describe('user registration api', function() {
		
		it('should be able to do registration', function(done) {
			var user = {
				username: 'anna',
				password: 'pass' 
			};
			
			request(url)
			.post(cfg.app.api_url + '/register')
			.send(user)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
					//throw err;
				}
				log.debug('POST /register return = %j', res.body);
				token = res.body.token;
				//post_id_list.push(res.body._id)
				//res.body.should.have.property('title', 'once we have specified the info we');
				done();
			});
		});
	});
	
	describe('user login api', function() {
		
		it('should be able to login', function(done) {
			var user = {
				username: 'anna',
				password: 'pass' 
			};
			
			request(url)
			.post(cfg.app.api_url + '/login')
			.send(user)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
					//throw err;
				}
				log.debug('POST /login return = %j', res.body);
				token = res.body.token;
				//post_id_list.push(res.body._id)
				res.body.should.have.property('token', token);
				done();
			});
		});
		
		it('should support find all posts', function(done) { 
			
			log.debug('GET find all posts token = %s', token);
			request(url)
			.get(cfg.app.api_url + '/posts')
			.set('Authorization', 'Bearer ' + token)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			//.expect(200)
			.end(function(err, res) {
				if (err) {
					log.debug('GET find all posts error = %j', err);
					return done(err);
					//throw err;
				}
				
				//var result = JSON.parse(res.body);
				
				//log.debug('GET posts = %j', res);
				//post_id_list.push(res.body._id)
				//res.body.should.have.property('title', 'once we have specified the info we');
				done();
			});
		});
	});
	
});