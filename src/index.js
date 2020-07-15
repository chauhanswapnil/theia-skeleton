const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose.js');
const { checkAuth } = require('../middlewares/auth.js');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const userRoutes = require('../routes/user');
const postRoutes = require('../routes/post');

app.get('/', (_, res) => {
	res.send('Hello Jenkins..!');
});
app.get('/hello', (_, res) => {
	res.send('New Feature 232323232-555555 COMPLETED');
});

app.get('/add', (_, res) => {
	const User = mongoose.model('User', { name: String });
	const newUser = new User({ name: 'Wonder Woman' });
	newUser
		.save()
		.then(() => {
			console.log('New User Saved..!');
			res.send('Successfully Added User!');
		})
		.catch((err) => {
			console.log('Error Adding New User..!');
			res.send('Error Adding User', err);
		});
});

app.use('/api', checkAuth, userRoutes);
app.use('/api', checkAuth, postRoutes);
// app.use('/api', userRoutes);

app.listen(process.env.PORT, () => {
	console.log('Listening on port', process.env.PORT);
});
