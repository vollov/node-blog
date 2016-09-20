var mongoose = require('mongoose');
var _ = require('underscore');

require('../../models/Auth');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var Permission = mongoose.model('Permission');

var cfg = require('../../config.js');
var log = require('../../lib/test_logger');

mongoose.connect('mongodb://localhost/'+ cfg.db.name, function(err,db){
			if (!err){
				log.debug('Connected to db: ' + cfg.db.name);
			} else{
				//console.dir(err); //failed to connect
				log.error(err);
			}
			
		});

var r1 = new Role({ name: 'manager', description: 'manager' });
var r2 = new Role({ name: 'member', description: 'member' });


r1.save(function (err) {
	if (err) return handleError(err);
});

r2.save(function (err) {
	if (err) return handleError(err);
});

var p1 = new Permission({ slug: 'add-team', url: '/team/add', roles: [r1._id, r2._id]});
var p2 = new Permission({ slug: 'list-teams', url: '/teams'});


p1.save(function (err) {
	if (err) return handleError(err);
});
