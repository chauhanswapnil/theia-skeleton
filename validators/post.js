const { check } = require('express-validator');

exports.postValidator = [ check('content').not().isEmpty().withMessage('You cannot create an empty post!') ];
