var should = require('should'); 
var assert = require('assert');

var cfg = require('../../config.js');

describe('Configuration module', function() {
	
	describe('application', function() {
		
		it('should have properties', function(done) { 
			var app = cfg.app;
			
			app.should.have.property('api_url', '/api/v1.0');
			app.should.have.property('port', 3008);
			done();
		});
	});
})