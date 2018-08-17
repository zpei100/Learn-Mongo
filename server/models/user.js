const {mongoose} = require('../db/mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken'); 
const _ = require('lodash');

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
	var token = jwt.sign({_id: this._id.toString(), access: access}, 'abc123').toString();
	this.tokens = this.tokens.concat([{access, token}]);
	
	return this.save().then(() => {
		return token;
	})
};

//mongoose.model() returns a constructor that follows the UserSchema provided
var User = mongoose.model('users', UserSchema);
module.exports = {User}