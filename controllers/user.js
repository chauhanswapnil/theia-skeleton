const { checkUserExists } = require('../database/services/user');
const checkAuth = require('../middlewares/auth');
const User = require('../database/model/user');
const fs = require('fs');
const { sendErrorMessage } = require('../helpers');
const { uploadSingleImageToS3 } = require('../helpers/aws-helpers');

const addUser = (req, res) => {
	const uid = req.uid;
	const { email, name } = req.body;
	User.findOne({ uid }).exec((err, user) => {
		if (err) return res.status(400).json(sendErrorMessage(err));
		if (!user) {
			let newUser = new User({ name, email, uid });
			newUser.save((err, user) => {
				if (err) return res.status(400).json(sendErrorMessage(err));
				else return res.json({ user: user });
			});
		} else return res.json({ user: user });
	});
};

const getUser = (req, res) => {
	const uid = req.uid;
	User.findOne({ uid }).exec((err, user) => {
		if (err) return res.status(400).json(sendErrorMessage(err));
		if (!user) return res.status(400).json(sendErrorMessage('User Not Found.!'));
		else return res.json({ user: user });
	});
};

const uploadProfileImage = async (req, res) => {
	const uid = req.uid;
	try {
		const data = await uploadSingleImageToS3(req.file.originalname, req.file.path, '/profile_image');
		fs.unlinkSync(req.file.path);
		const locationUrl = data.Location;
		try {
			let user = await User.findOneAndUpdate({ uid }, { profile_image: locationUrl }, { new: true });
			if (!user) return res.status(400).json(sendErrorMessage('User Not Found'));
			return res.json({ user: user });
		} catch (err) {
			return res.status(400).json(sendErrorMessage(err));
		}
	} catch (err) {
		return res.status(400).json(sendErrorMessage(err));
	}
};

module.exports = { getUser, addUser, uploadProfileImage };
