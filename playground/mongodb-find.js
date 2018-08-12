const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to database');
	}

	db.collection('Todo').find().count().then((count) => {
		console.log('todos count: ', count);
	}, (err) => {
		console.log('unable to fetch todos', err);
	});


	// db.collection('Todo').find({
	// 	_id: new ObjectID('5b6f77a60294fad696e57691')
	// }).toArray().then((docs) => {
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('unable to fetch todos', err);
	// });
})