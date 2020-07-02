const express = require('express');
const router = express.Router();
const { getUser, addUser } = require('../controllers/user.js');

// Validators
const { runValidation } = require('../validators');
const { userValidator } = require('../validators/user');

router.get('/user', getUser);
router.post('/user', userValidator, runValidation, addUser);

module.exports = router;
