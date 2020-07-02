const { check } = require('express-validator');

exports.userValidator = [
	check('name').not().isEmpty().withMessage('Name is Required!'),

	check('email').isEmail().withMessage('Must be a valid Email Address!')
];
