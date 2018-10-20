const database = require('./database');
const ajv = require('./ajv');
const bcrypt = require('bcrypt');
const logs = require('./logs');
const authentication = require('./authentication');
const _ = require('lodash');

// MIDDLEWARE
async function list(request, response) {
	try {
		const result = await database.list(request.params.collection, request.body);
		response.type('json');
		response.send(result);
	}
	catch (exception) {
		logs.log(exception, request);
		response.sendStatus(500);
	}
}

async function get(request, response) {
	try {
		const result = await database.get(request.params.collection, { _id: request.params.id });
		response.type('json');
		response.send(result);
	}
	catch (exception) {
		logs.log(exception, request);
		response.sendStatus(500);
	}
}

async function insert(request, response) {
	try {
		if (ajv.validate(request.params.collection, request.body)) {
			if (request.params.collection === 'users') {
				request.body.password = await bcrypt.hash(request.body.password, 10);
			}
			request.body._createdAt = new Date();
			request.body._createdBy = authentication.current(request);
			const result = await database.insert(request.params.collection, request.body);
			response.type('json');
			response.send(result);
		}
		else {           
			response.sendStatus(403);
		}
	}
	catch (exception) {	
		logs.log(exception, request);
		response.sendStatus(500);
	}
}

async function remove(request, response) {
	try {
		const result = await database.remove(request.params.collection, request.params.id);
		response.type('json');
		response.send(result);
	}
	catch (exception) {
		logs.log(exception, request);
		response.sendStatus(500);
	}
}

async function update(request, response) {
	try {
		if (ajv.validate(request.params.collection, request.body)) {
			if (request.params.collection === 'users') {
				if (request.body.password) {
					request.body.password = await bcrypt.hash(request.body.password, 10);
				}
				else {
					request.body = _.omit(request.body, 'password');
				}				
			}
			request.body._updatedAt = new Date();
			request.body._updatedBy = authentication.current(request);
			const result = await database.update(request.params.collection, request.body);
			response.type('json');
			response.send(result);
		}
		else {
			response.sendStatus(403);
		}
	}
	catch (exception) {
		logs.log(exception, request);
		response.sendStatus(500);
	}
}

module.exports = {
	list,
	get,
	insert,
	update,
	remove
};