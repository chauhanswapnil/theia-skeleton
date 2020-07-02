const Post = require('../database/model/post');
const { errorHandler } = require('../helpers/dbErrorHandler');

const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

const createPost = (req, res) => {
	const { content } = req.body;
	const { _id } = req.user;
	const newPost = new Post({ content, posted_by: _id });

	newPost.save((err, post) => {
		if (err) {
			return res.status(400).json({ error: { message: errorHandler(err) } });
		} else {
			return res.json({ post: post });
		}
	});
};

const getAllPosts = (req, res) => {
	const limit = parseInt(req.query.limit);
	const skip = parseInt(req.query.skip);
	const { search } = req.query;
	var searchValue = {};
	if (search) {
		searchValue = { $or: [ { content: { $regex: search, $options: 'i' } } ] };
	}
	Post.find(searchValue)
		.limit(limit)
		.skip(skip)
		.sort({ _id: -1 })
		.populate('posted_by', '_id name')
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({ error: { message: errorHandler(err) } });
			} else {
				res.json(result);
			}
		});
};

const getSingleUserPosts = (req, res) => {
	const { id } = req.params;
	// const _id = mongoose.Types.ObjectId('5eefb47c752ed01bfef802bb');

	if (ObjectId.isValid(id)) {
		const _id = mongoose.Types.ObjectId(id);
		Post.find({ posted_by: _id }).populate('posted_by', '_id name').sort({ _id: -1 }).exec((err, result) => {
			if (err) {
				const errorMessage = errorHandler(err) !== '' ? errorHandler(err) : err.message;
				return res.status(400).json({ error: { message: errorMessage } });
			} else {
				res.json(result);
			}
		});
	} else {
		res.json([]);
	}
};

module.exports = { createPost, getAllPosts, getSingleUserPosts };
