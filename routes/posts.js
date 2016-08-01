var mongoose = require('mongoose');
var cfg = require('../config');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var jwtauth = expressJwt({secret: cfg.token.secret, userProperty: cfg.token.user_property});


var log = require('../lib/logger');

router.get('/', function(req, res, next) {
	Post.find(function(err, posts) {
		if (err) {
			log.error('HTTP GET /posts -- get all posts, err = %j', err);
			return res.status(500).json(err);
		}

		res.status(200).json(posts);
	});
});

/**
 * create new post
 */
router.post('/', jwtauth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;
	
	post.save(function(err, post) {
		if (err) {
			return next(err);
		}

		res.status(200).json(post);
	});
});

router.get('/:id', function(req, res, next) {
	var id = req.params.id;	
	log.debug('HTTP GET /posts/:id -- id = %s', id);
	
	var query = Post.findById(id).populate('comments');

	query.exec(function(err, post) {
		if (err) {
			return next(err);
		}
		if (!post) {
			return next(new Error("can't find post"));
		}
		
		log.debug('HTTP GET post by id, return post= %j', post);
		res.status(200).json(post);
	});
});

router.delete('/:id', jwtauth, function(req, res, next){
	var id = req.params.id;
	var query = Post.findById(id).remove();
	
	query.exec(function(err, post) {
		if (err) {
			return next(err);
		}
		if (!post) {
			return next(new Error("can't find post"));
		}
		
		log.debug('DELETE by id post= %j', post);
		res.status(200).json(post);
	});
});

router.put('/:id', jwtauth, function(req, res, next) {
	var id = req.params.id;
	var body = req.body;
	
	log.debug('calling put body =%j', body);
	
	Message.findByIdAndUpdate(id, { $set: body}, function (err, message) {
		  // if (err) return handleError(err);
		if(err) return next(err);
		  res.status(200).json(message);
	});
});


router.post('/:id/comments', jwtauth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment){
		if(err)	return next(err);

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err){ return next(err); }

			res.json(comment);
		});
	});
});

module.exports = router;