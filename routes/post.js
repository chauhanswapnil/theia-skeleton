const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost, getAllPosts, getSingleUserPosts } = require('../controllers/post.js');
const { getUserMiddleware } = require('../middlewares/auth.js');

// Validators
const { fileFilterImage } = require('../helpers/aws-helpers');

// router.get('/user', getUser);
router.post(
	'/post',
	getUserMiddleware,
	multer({ dest: 'temp/', fileFilter: fileFilterImage, limits: { fieldSize: 8 * 1024 * 1024 } }).single('post_image'),
	createPost
);

router.get('/post', getAllPosts);

router.get('/post/:id', getSingleUserPosts);

module.exports = router;
