var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
	name : {
		type : String,
		lowercase : true,
		unique : true
	},
	url : {
		type : String,
		lowercase : true
	},
	action : {
		type: String,
		enum: ['post', 'put', 'get', 'delete']
	},
	description: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	}
});

mongoose.model('Subject', SubjectSchema);