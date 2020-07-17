const User = require('../database/model/user');
const fs = require('fs');
const { sendErrorMessage } = require('../helpers');
const { uploadSingleImageToS3, deleteSingleImageFromS3 } = require('../helpers/aws-helpers');
const ERRORS = require('../helpers/error-codes');

const addUser = (req, res) => {
	const uid = req.uid;
	const { email, name } = req.body;
	User.findOne({ uid }).exec((err, user) => {
		if (err) return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
		if (!user) {
			let newUser = new User({ name, email, uid });
			newUser.save((err, user) => {
				if (err) return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
				else return res.json({ user: user });
			});
		} else return res.json({ user: user });
	});
};

const getUser = (req, res) => {
	const uid = req.uid;
	User.findOne({ uid }).exec((err, user) => {
		if (err) return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
		if (!user) return res.status(ERRORS.NOT_FOUND).json(sendErrorMessage('User Not Found.!'));
		else return res.json({ user: user });
	});
};

const updateUser = async (req, res) => {
	const uid = req.uid;
	if (req.fileError) return res.status(ERRORS.BAD_REQUEST).json(sendErrorMessage(req.fileError));
	try {
		const user = await User.findOne({ uid });
		if (!user) return res.status(ERRORS.NOT_FOUND).json(sendErrorMessage('User Not Found'));
		if (req.body.name) user.name = req.body.name;
		if (req.body.profile_image && user.profile_image !== '') {
			try {
				await deleteSingleImageFromS3(user.profile_image);
				user.profile_image = '';
			} catch (err) {
				return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage('Error Deleting Image'));
			}
		}
		if (req.file && req.file.fieldname === 'profile_image') {
			console.log('inside afosjc');
			// Delete Image
			if (user.profile_image) {
				//Delete
				try {
					await deleteSingleImageFromS3(user.profile_image);
					user.profile_image = '';
					// Upload Image
					try {
						const data = await uploadSingleImageToS3(req.file.originalname, req.file.path, 'profile_image');
						fs.unlinkSync(req.file.path);
						user.profile_image = data.Location;
					} catch (err) {
						return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage('Error Uploading Image'));
					}
				} catch (err) {
					return res
						.status(ERRORS.INTERNAL_SERVER_ERROR)
						.json(sendErrorMessage('Unable to Delete Old Image'));
				}
			} else {
				try {
					const data = await uploadSingleImageToS3(req.file.originalname, req.file.path, 'profile_image');
					fs.unlinkSync(req.file.path);
					user.profile_image = data.Location;
				} catch (err) {
					return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage('Error Uploading Image'));
				}
			}
		}
		try {
			let newUser = await user.save();
			return res.json({ user: newUser });
		} catch (err) {
			return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
		}
	} catch (err) {
		return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
	}
};

module.exports = { getUser, addUser, updateUser };
