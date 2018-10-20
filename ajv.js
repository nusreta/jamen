const Ajv = require('ajv');

function validate(collection, data) {
	try {
		const path = './schema/' + collection + '.json';	
		const schema = require(path);
		const ajv = new Ajv({ allErrors: true });
		const validate = ajv.compile(schema);
		return validate(data);		
	}
	catch (exception) {
		return true;
	}
}

module.exports = {
	validate
};