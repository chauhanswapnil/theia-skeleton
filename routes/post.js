const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getSingleUserPosts } = require('../controllers/post.js');
const { getUserMiddleware } = require('../middlewares/auth.js');

// Validators
const { runValidation } = require('../validators');
const { postValidator } = require('../validators/post');

// router.get('/user', getUser);
router.post('/post', getUserMiddleware, postValidator, runValidation, createPost);

router.get('/post', getAllPosts);

router.get('/post/:id', getSingleUserPosts);

module.exports = router;
