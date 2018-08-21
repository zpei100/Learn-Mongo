const {mongoose} = require('../db/mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken'); 
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,  //won't have two documents with the same email
		validate: {
			validator: validator.isEmail,			
			//mongoose's native injection: {} inside any string
			message: `{value} is not a valid email` 
		}	
	},
	password: {
		type: String,
		required: true,
		minlength: 6 
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

//overide the instance method: toJSON, which returns only the id and email
//properties of the user object
UserSchema.methods.toJSON = function () {
	return _.pick(this.toObject(), ['_id', 'email']);
};


//create a new method for an instance user:
//define an access variable
//create a token with the user's id and access variable
//add this token to the user's tokens field
//saves the user to the Users collection in the database
//returns the token

UserSchema.methods.generateAuthToken = function() {
	var access = 'auth';
	//use jwt library to create a token for the document (user)
	var token = jwt.sign({_id: this._id.toString(), access: access}, 'abc123').toString();
	//add this token to the tokens array field. They are paired so that each token is for a single 'access'
	this.tokens = this.tokens.concat([{access, token}]);
	
	return this.save().then(() => {
		return token;
	})
};

//custom define a findByToken method for the user class
//.method is for instances, .static is for class
UserSchema.statics.findByToken = function(token) {
	var decoded;

	try {
		//decoded is just the original object before the encryption: jwt.sign
		//by the above definition, it has fields: _id and access
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		//ends the findByToken function so it doesn't continue down below and try to find the document
		//instead, it returns a reject, which will trigger a catch in whatever function that calls it
		return new Promise((resolve, reject) => {
			reject();
		})
	}

	//if the try was successful, in other words, jwt.verify succeeds, or the user is validated
	//find the user and return the object
	return this.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
};

UserSchema.statics.findByCredentials = function(email, password) {
	return this.findOne({'email': email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise ((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.pre('save', function(next) {
	if (this.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(this.password, salt, (err, hash) => {
				this.password = hash;
				next();
			})
		});
	} else {
		next();
	}
})

//adds a method for user to remove token
//$pull is a special mongoose operator that pulls out the matching
//item from an array
//user.update returns a promise: the updated user
UserSchema.methods.removeToken = function(token) {
	return this.update({
		$pull: {
			tokens: {token}
		}
	})
};

//mongoose.model() returns a constructor that follows the UserSchema provided
var User = mongoose.model('users', UserSchema);
module.exports = {User}