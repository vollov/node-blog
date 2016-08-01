'use strict';

var winston = require('winston');
var cfg = require('../config');

var logger = new (winston.Logger)({
	exitOnError : false,
	transports : [
	// new (winston.transports.Console)(),
	new (winston.transports.File)({
		name : 'info-file',
		filename : cfg.app.app_root + '/logs/info.log',
		level : 'info'
	}), new (winston.transports.File)({
		name : 'error-file',
		filename : cfg.app.app_root + '/logs/error.log',
		level : 'error'
	}), new (winston.transports.File)({
		name : 'debug-file',
		filename : cfg.app.app_root + '/logs/debug.log',
		level : 'debug'
	}) ]
});

//logger.remove('debug-file');

module.exports = logger;