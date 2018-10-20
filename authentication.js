const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('./database');
const logs = require('./logs');

function headers(request, response, next) {
	response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
}

async function authenticate(request, response) {
	try {
		const user = await database.get('users', { username: request.body.username });
		if (user) {
			const match = await bcrypt.compare(request.body.password, user.password);
			if (match) {
				const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
				response.type('json');
				response.send({ token, user });
			}
			else {
				return response.sendStatus(401);
			}
		}
		else {
			return response.sendStatus(404);
		}
	}
	catch (exception) {
		logs.log(exception, request);
		response.sendStatus(401);
	}
}

function current(request) {
	try {
		if (request.headers.authorization) {
			const token = request.headers.authorization.replace('Bearer ', '');
			const decoded = jwt.decode(token);
			return decoded.userId;
		}
	}
	catch (exception) {
		return null;
	}
	return null;
}

module.exports = {
	authenticate,
	headers,
	current
};