const mongo_driver = require('mongodb');
const mongo_client = mongo_driver.MongoClient;
const ObjectId = mongo_driver.ObjectID;
const _ = require('lodash');
let db;

// CONNECT TO DATABASE
async function connect() {
	try {
		db = await mongo_client.connect(process.env.MONGO_SERVER, { useNewUrlParser: true });
		const data = db.db(process.env.MONGO_DATABASE);
		return data;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

// METHODS
async function list(collection, filter = {}) {
	try {
		const data = await connect();
		const cursor = await data.collection(collection).find(filter);
		const documents = cursor.toArray();
		await db.close();
		return documents;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

async function get(collection, filter = {}) {
	try {
		if (filter._id) {
			filter._id = ObjectId(filter._id);
		}
		const data = await connect();
		const document = await data.collection(collection).findOne(filter);
		await db.close();
		return document;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

async function insert(collection, document) {
	try {
		const data = await connect();
		document = _.omit(document, '_id');
		var id = await data.collection(collection).insertOne(document);
		await db.close();
		return id;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

async function update(collection, document) {
	try {
		const data = await connect();
		await data.collection(collection).updateOne({ _id: ObjectId(document._id) }, { $set: _.omit(document, '_id') });
		await db.close();
		return true;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

async function remove(collection, id) {
	try {
		const data = await connect();
		await data.collection(collection).deleteOne({ _id: ObjectId(id) });
		await db.close();
		return true;
	}
	catch (exception) {
		if (db) {
			await db.close();
		}
		throw exception;
	}
}

module.exports = {
	list,
	get,
	insert,
	update,
	remove
};