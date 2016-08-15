var mongoose = require('mongoose');

var RoleSchema = new mongoose.Schema({
	name : {
		type : String,
		lowercase : true,
		unique : true
	},
	description: {
		type: String
	},
	subjects : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Subject'
	} ],
	created: {
		type: Date
	},
	updated: {
		type: Date
	}
});

mongoose.model('Role', RoleSchema);