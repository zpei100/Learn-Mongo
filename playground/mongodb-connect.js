// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb')
	// this line of code is the same as:
	// MongoClient = require('mongodb').MongoClient and
	// ObjectID = require('mongodb').ObjectID

// var obj = new ObjectID();
	// this generates a new objectID for a mongo document

/* workflow of mongodb
	npm install mongodb
	require mongodb.MongoClient
	call MongoClient.connect(protocol://server/databaseName, callback(error, database))
	if error, stop program and print error message
	if success, call db.collection(collectionName).insertOne(document, callback(err, result))
	console.log result.ops to see the added 'document'
	note: re-running the same code will add the 'same' document multiple times into the same collection
*/



	// db.close()

























/*
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect to db server');	
	}	
	console.log('Connected to a db mongo server');
	// db.collection('Todo').insertOne({
	// 	text: 'something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'pei',
	// 	age: 28,
	// 	location: 'nyc'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// });


	db.close();	

}); // this connects to a mongo database server

*/