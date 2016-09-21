var mongoose = require('mongoose');
var cfg = require('../config');
var express = require('express');
var router = express.Router();

var Role = mongoose.model('Role');
var log = require('../lib/logger');

router.get('/', function(req, res, next) {
	Role.find(function(err, roles) {
		if (err) {
			log.error('HTTP GET /roles -- get all roles, err = %j', err);
			return res.status(500).json(err);
		}

		res.status(200).json(roles);
	});
});

router.post('/', function(req, res, next) {
	var role = new Role(req.body);
	
	role.save(function(err, role) {
		if (err) {
			return next(err);
		}

		res.status(200).json(role);
	});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;	
	log.debug('HTTP GET /roles/:id -- id = %s', id);
	
	var query = Role.findById(id);//.populate('comments');

	query.exec(function(err, role) {
		if (err) {
			return next(err);
		}
		if (!role) {
			return next(new Error("can't find role"));
		}
		
		log.debug('HTTP GET role by id, return role= %j', role);
		res.status(200).json(role);
	});
});

router.delete('/:id', function(req, res, next){
	var id = req.params.id;
	var query = Role.findById(id).remove();
	
	query.exec(function(err, role) {
		if (err) {
			return next(err);
		}
		if (!role) {
			return next(new Error("can't find role"));
		}
		
		log.debug('DELETE by id role= %j', role);
		res.status(200).json(role);
	});
});

router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
	
	log.debug('calling put body =%j', body);
	
	Role.findByIdAndUpdate(id, { $set: body }, function (err, doc) {
		  // if (err) return handleError(err);
		if(err) return next(err);
		  res.status(200).json(doc);
	});
});

module.exports = router;