
module.exports= {
	authorization: function(req, res, next) {
		console.log('LOGGED');
		next();
	}
}