const express = require('express');
const router = express.Router();
const { getUser, addUser, updateUser } = require('../controllers/user.js');
const multer = require('multer');

// Validators
const { runValidation } = require('../validators');
const { userValidator } = require('../validators/user');

const { fileFilterImage } = require('../helpers/aws-helpers');

router.get('/user', getUser);
router.post('/user', userValidator, runValidation, addUser);
router.patch(
	'/user',
	multer({ dest: 'temp/', fileFilter: fileFilterImage, limits: { fieldSize: 8 * 1024 * 1024 } }).single(
		'profile_image'
	),
	updateUser
);
module.exports = router;
