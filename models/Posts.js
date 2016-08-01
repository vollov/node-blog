var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title : String,
	content : String,
	author : String,
	comments : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Comment'
	} ]
});

PostSchema.pre('remove', function(next){
	console.log('pre remove()');
	comments.remove({post: this._id}).exec();
	next();
});

mongoose.model('Post', PostSchema);