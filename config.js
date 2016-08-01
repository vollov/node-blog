'use strict';
var path = require('path');

module.exports = {
	
	db:{
		host: 'localhost',
		name: 'nblog',
		port: '27017',
	},
	
	token:{
		secret: 'uwotm8xxc',
		user_property: 'payload', 
		age: '30m'
	},
	
	app:{
		app_root: __dirname,
		api_url:'/api/v1.0',
		port:3008
	},
	
	test:{
		url : 'http://localhost:3008'
	},
};

//To use:
//var cfg = require('./config');
//cfg.db.port