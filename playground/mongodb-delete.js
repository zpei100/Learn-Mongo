const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongDB server');

	// deleteMany
		// db.collection('Todo').deleteMany({text: 'eat lunch'}).then((result) => {
		// 	console.log(result);

	// deleteOne
		// db.collection('Todo').deleteOne({test: 'Eat lunch'}).then((result) => {
		// 	console.log(result);
		// })


	// findOneAndDelete
		// delete one and return the value (can show user what document is delted)
	db.collection('Todo').findOneAndDelete({completed: false}).then((result) => {
		console.log(result)
	});


	db.close()
});
