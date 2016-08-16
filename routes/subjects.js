var mongoose = require('mongoose');
var cfg = require('../config');

var Subject = mongoose.model('Subject');
var Role = mongoose.model('Role');

var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var jwtauth = expressJwt({secret: cfg.token.secret, userProperty: cfg.token.user_property});


var log = require('../lib/logger');

router.get('/', function(req, res, next) {
	Subject.find(function(err, subjects) {
		if (err) {
			log.error('HTTP GET /posts -- get all subjects, err = %j', err);
			return res.status(500).json(err);
		}

		res.status(200).json(subjects);
	});
});

/**
 * create new subject
 */
router.post('/', function(req, res, next) {
	var subject = new Subject(req.body);
	
	subject.save(function(err, subject) {
		if (err) {
			return next(err);
		}

		res.status(200).json(subject);
	});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;	
	log.debug('HTTP GET /subjects/:id -- id = %s', id);
	
	var query = Subject.findById(id);

	query.exec(function(err, subject) {
		if (err) {
			return next(err);
		}
		if (!subject) {
			return next(new Error("can't find subject"));
		}
		
		log.debug('HTTP GET subject by id, return subject= %j', subject);
		res.status(200).json(subject);
	});
});

router.delete('/:id', function(req, res, next){
	var id = req.params.id;
	var query = Subject.findById(id).remove();
	
	query.exec(function(err, subject) {
		if (err) {
			return next(err);
		}
		if (!subject) {
			return next(new Error("can't find subject"));
		}
		
		log.debug('DELETE by id subject= %j', subject);
		res.status(200).json(subject);
	});
});

router.put('/:id', function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
	
	log.debug('calling put body =%j', body);
	
	Subject.findByIdAndUpdate(id, {$set: body}, function (err, subject) {
		// if (err) return handleError(err);
		if(err) return next(err);
		  res.status(200).json(subject);
	});
});

/**
 * add existing role to subject
 */
router.post('/:id/subjects/:rid', function(req, res, next) {
	var rid = req.params.rid;
	var id = req.params.id;
	
	var current_subject;
	Subject.findById(id).exec().then(function(subject){
		current_subject =  subject;
	}).catch(function(err){
		// just need one of these
		console.log('error loading subject:', err);
	});
	
	var promise = Role.findById(rid).exec();
	
	// insert subject into role.subjects
	promise.then(function(role){
		role.subjects.push(current_subject);
		role.save();
		//current_role= role;
	}).catch(function(err){
		// just need one of these
		console.log('error:', err);
	});
});

module.exports = router;