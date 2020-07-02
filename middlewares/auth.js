const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = require('../theia-skeleton-firebase-key.json');
const User = require('../database/model/user');

admin.initializeApp({
	credential : admin.credential.cert(serviceAccount)
});

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
				res.status(403).json({ error: { message: 'Unauthorized' } });
			});
	} else {
		res.status(403).json({ error: { message: 'Unauthorized' } });
	}
};

const getUserMiddleware = async (req, res, next) => {
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
			req.user = user;
			next();
		}
	});
};

module.exports = { checkAuth, getUserMiddleware };
