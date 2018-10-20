const database = require('./database');
const bcrypt = require('bcrypt');

async function init() {
	const users = await database.list('users');
	if (users.length === 0) {
		const user = {
			username: 'jamen',
			password: await bcrypt.hash('jamen', 10),
			_createdAt: new Date(),
			_createdBy: null
		};
		await database.insert('users', user);
	}
}

module.exports = {
	init
};