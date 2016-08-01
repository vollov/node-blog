// add user
//node manager.js user pwd

var mongoose = require('mongoose');
var _ = require('underscore');

require('./models/Users');
var User = mongoose.model('User');

var cfg = require('./config.js');
//var bunyan = require('bunyan');
//var log = bunyan.createLogger(_.extend(cfg.test_log, {name: 'manager'}));

var username = process.argv[2];
var password = process.argv[3];

console.log('creating user username={0}, password={1}', username, password);

mongoose.connect('mongodb://localhost/'+ cfg.db.name, function(err,db){
    if (!err){
        console.log('Connected to db: ' + cfg.db.name);
    } else{
        console.dir(err); //failed to connect
    }
});

var user = new User();
user.username = username;
user.setPassword(password);

user.save(function(err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('user created');
	mongoose.disconnect();
});
