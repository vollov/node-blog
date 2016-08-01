var should = require('should'); 
var assert = require('assert');

var log = require('../../lib/logger');

describe('Logging module', function() {
	
	describe('logger', function() {
		
		it('should be able to log info', function(done) { 
			log.info('Way to extend %s function.', 'Assertion');
			log.debug('Debug %s function.', 'Assertion');
			log.error('Error %s function.', 'Assertion');
			done();
		});
	});
})