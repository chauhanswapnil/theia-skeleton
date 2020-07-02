const { checkUserExists } = require('../database/services/user');
const checkAuth = require('../middlewares/auth');
const User = require('../database/model/user');

const addUser = (req, res) => {
	const uid = req.uid;
	const { email, name } = req.body;

	User.findOne({ uid }).exec((err, user) => {
		if (err) {
			return res.status(400).json({
				error : {
					message : err.message
				}
			});
		}
		if (!user) {
			let newUser = new User({ name, email, uid });
			newUser.save((err, user) => {
				if (err) {
					return res.status(400).json({ error: { message: err.message } });
				} else {
					console.log('Creating new user...!', user);
					return res.json({ user: user });
				}
			});
		} else {
			console.log('User Already Exists');
			return res.json({ user: user });
		}
	});
};

const getUser = (req, res) => {
	const uid = req.uid;
	User.findOne({ uid }).exec((err, user) => {
		if (err) {
			return res.status(400).json({
				error : {
					message : err.message
				}
			});
		}
		if (!user) {
			return res.status(400).json({
				error : {
					message : 'User Not Found!'
				}
			});
		} else {
			return res.json({ user: user });
		}
	});
};

module.exports = { getUser, addUser };
