var should = require('should'); 
var assert = require('assert');
 
var mongoose = require('mongoose');
var _ = require('underscore');

require('../../models/Posts');
var Post = mongoose.model('Post');

var cfg = require('../../config.js');
var log = require('../../lib/test_logger');

describe('Posts DB', function() {
	
	before(function(done){
		log.debug('db setup test in before()');
		
		mongoose.connect('mongodb://localhost/'+ cfg.db.name, function(err,db){
			if (!err){
				log.debug('Connected to db: ' + cfg.db.name);
			} else{
				//console.dir(err); //failed to connect
				log.error(err);
			}
			done();
		});
	});
	
	describe('list all posts', function() {
		
		it('should find all posts ', function(done) { 
			Post.find({}).exec(function(err, posts) {
				if (err) {
					log.error('DB -- all posts, err = %j', err);
					//return next(err);
				}
				done();
			});
		});
	});
	
	after(function(done){
		mongoose.connection.close(function(err) {
			done();
		});
	});
});
