const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name          : {
			type     : String,
			trim     : true,
			required : true,
			max      : 32
		},
		email         : {
			type      : String,
			trim      : true,
			required  : true,
			unique    : true,
			lowercase : true
		},
		profile_image : {
			type : String,
			trim : true
		},
		uid           : {
			type     : String,
			required : true,
			unique   : true,
			trim     : true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
