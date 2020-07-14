const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
	{
		content   : {
			type     : String,
			trim     : true,
			required : true,
			max      : 2000000,
			index    : true
		},
		posted_by : {
			type : ObjectId,
			ref  : 'User'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
