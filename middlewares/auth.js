const ERRORS = require('../helpers/error-codes');
const admin = require('firebase-admin');
const { sendErrorMessage } = require('../helpers');
require('dotenv').config();
const User = require('../database/model/user');
require('dotenv').config();

admin.initializeApp({
	credential : admin.credential.cert(
		JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))
	)
});

// admin.initializeApp({
// 	credential : admin.credential.cert(serviceAccount)
// });

const checkAuth = async (req, res, next) => {
	const idToken = req.header('idToken');
	if (idToken) {
		admin
			.auth()
			.verifyIdToken(idToken)
			.then((decodedToken) => {
				let uid = decodedToken.uid;
				req.uid = uid;
				next();
			})
			.catch(() => {
				return res.status(ERRORS.UNAUTHORIZED).json(sendErrorMessage('Unauthorized'));
			});
	} else return res.status(ERRORS.UNAUTHORIZED).json(sendErrorMessage('Unauthorized'));
};

const getUserMiddleware = async (req, res, next) => {
	const uid = req.uid;
	User.findOne({ uid }).exec((err, user) => {
		if (err) {
			return res.status(ERRORS.INTERNAL_SERVER_ERROR).json(sendErrorMessage(err));
		}
		if (!user) {
			return res.status(ERRORS.NOT_FOUND).json(sendErrorMessage('User Not Found'));
		} else {
			req.user = user;
			next();
		}
	});
};

module.exports = { checkAuth, getUserMiddleware };
