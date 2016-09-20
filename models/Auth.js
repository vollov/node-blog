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

	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	}
});

mongoose.model('Role', RoleSchema);

var PermissionSchema = new mongoose.Schema({
	slug : {
		type : String,
		lowercase : true,
		unique : true
	},
	url : {
		type : String,
		lowercase : true
	},
	roles : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Role'
	}],
	action : {
		type : String
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

mongoose.model('Permission', PermissionSchema);

var UserSchema = new mongoose.Schema({
	username : {
		type : String,
		lowercase : true,
		unique : true
	},
	roles : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Role'
	} ],
	created: {
		type: Date
	},
	updated: {
		type: Date
	}
});
mongoose.model('User', UserSchema);

