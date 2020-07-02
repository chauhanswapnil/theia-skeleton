const User = require('../model/user');

const checkUserExists = async (uid, callBack) => {
	console.log('HI');
	await User.findOne({ uid }).exec((err, user) => {
		if (err) {
			console.log(err);
			return callBack(err);
		} else {
			if (user) {
				console.log(user);
				return callBack(user);
			} else {
				return callBack('No User Found');
			}
		}
	});
};

module.exports = { checkUserExists };
