var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  

var _ = require('underscore');

var cfg = require('../../../config.js');
var log = require('../../../lib/test_logger');

var mongoose = require('mongoose');
require('../../../models/Users');
var User = mongoose.model('User');


describe('Posts Route', function() {
	var url = cfg.test.url;
	var test_post_id;
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
	
	/**
	 * insert a special post
	 */
	before(function(done){
		log.debug('setup test in before()');

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

	// list push()
	describe('read and update', function() {
		it('should support insert post', function(done) { 
			var post = {
					title: 'once we have specified the info we',
					content: 'we need to actually perform the action on the resource, in this case we want to',
					author: 'dustin'
				};
				
			request(url)
			.post(cfg.app.api_url + '/posts')
			.set('Authorization', 'Bearer ' + token)
			.send(post)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
					//throw err;
				}
				test_post_id = res.body._id;
				//post_id_list.push(res.body._id);
				done();
				//res.body.should.have.property('title', 'once we have specified the info we');
			});
		});
		
		it('should support find post by id', function(done) { 
			request(url)
			.get(cfg.app.api_url + '/posts/' + test_post_id)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
					//throw err;
				}
				log.debug('GET post by id %s', res.body._id);
				//post_id_list.push(res.body._id)
				res.body.should.have.property('title', 'once we have specified the info we');
				done();
			});
		});
		
		it('should support update post', function(done) { 
			
			var post = {
				title: 'once we have specified the info we updated',
				content: 'we need to actually perform the action on the resource, in this case we want to update',
				author: 'dustin'
			};
			
			log.debug('PUT post by id %s', test_post_id);
			
			request(url)
			.put(cfg.app.api_url + '/posts/' + test_post_id)
			.set('Authorization', 'Bearer ' + token)
			.send(post)
			//.expect('Content-Type', /json/)
			//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
			//.expect(200)
			.end(function(err, res) {
				if (err) {
					log.error('find all posts err= %j', err);
					return done(err);
					//throw err;
				}
				log.debug('return PUT post by id %s', res.body._id);
				//post_id_list.push(res.body._id)
				//res.body.should.have.property('n',1);
				//res.body.should.have.property('ok', 1);
				//res.body.should.have.property('nModified', 1);
				done();
			});
		});
	});
	
	after(function (done){
		log.debug('clean up DB in after()');
		
		request(url)
		.delete(cfg.app.api_url + '/posts/' + test_post_id)
		.set('Authorization', 'Bearer ' + token)
		//.expect('Content-Type', /json/)
		//.expect('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With')
		.expect(200)
		.end(function(err, res) {
			if (err) {
				return done(err);
				//throw err;
			}
			log.debug('deleted post by id %s', res.body._id);
			//post_id_list.push(res.body._id)
			//res.body.should.have.property('title', 'once we have specified the info we');
			done();
		});
		
//		console.log('clean up in after(), size = ' + post_id_list.length);
//		//value, key, list
//		_.each(post_id_list, function(value){
//			

//		});
//		post_id_list = [];
	});
});