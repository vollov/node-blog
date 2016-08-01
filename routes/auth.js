var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var User = mongoose.model('User');

/**
 * Save user and generate a new token for response
 */
router.post('/register', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}
	
	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password)

	user.save(function(err) {
		if (err) {
			return next(err);
		}

		return res.json({
			token : user.generateJWT()
		})
	});
});


router.post('/login', function(req, res, next) {
	if (!req.body.username) {
		return res.status(400).json({
			message : 'username required'
		});
	}
	
	if (!req.body.password) {
		return res.status(400).json({
			message : 'password required'
		});
	}

	User.findOne({username : req.body.username}, function(err, user) {
		if (err) {
			return res.status(500).json({
				message : 'login error when find user by username' 
			});
		}
		if (!user) {
			return res.status(401).json({
				message : 'login a non-existing user' 
			});
		}
		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({
				message : 'Incorrect password.' 
			});
		}
		
		return res.status(200).json({
			token : user.generateJWT()
		})
	});
});

module.exports = router;