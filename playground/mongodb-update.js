const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongDB server');

	// update takes arguments( filter, update == must use update operator, options, callback)
	db.collection('Todo').findOneAndUpdate({
		_id: new ObjectID("5b708508e3fc0a6922533fa6")
	}, 
		{
			$set: {
				completed: true			
			}
		}, {
			returnOriginal: false
		}).then((result) => {
			console.log(result);
		})


		db.collection('Todo').findOneAndUpdate(
			{_id: new ObjectID("5b6f77a60294fad696e57691")},
			{$set: {name: 'not pei'}},
			{returnOriginal: false},
			(result) => {console.log(result)} 
			);

		db.collection('Todo').findOneAndUpdate(
			{_id: new ObjectID("5b6f77a60294fad696e57691")},
			{$inc: {age: 1}},
			{returnOriginal: false},
			(result) => {console.log(result)} 
			);


	db.close()
});
