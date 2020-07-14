const express = require('express');
const router = express.Router();
const { getUser, addUser, uploadProfileImage } = require('../controllers/user.js');
const multer = require('multer');

// Validators
const { runValidation } = require('../validators');
const { userValidator } = require('../validators/user');

router.get('/user', getUser);
router.post('/user', userValidator, runValidation, addUser);
router.patch(
	'/user/image',
	multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('profile_image'),
	uploadProfileImage
);
module.exports = router;
