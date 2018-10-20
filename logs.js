const database = require('./database');
const authentication = require('./authentication');

// ERROR LOG SYSTEM
async function log(error, request) {
	try {
		const log = {		
			error,
			_createdAt: new Date(),
			_createdBy: authentication.current(request)
		};		
		database.insert('logs', log);		
	}
	catch (exception) {
		return;
	}
}

module.exports = {
	log
};