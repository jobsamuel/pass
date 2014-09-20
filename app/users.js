var mongoose = require('mongoose')
,	schema = {
				profile_id: String,
				name: String,
				photo: String
			}
,	userSchema = new mongoose.Schema(schema)
,	User = mongoose.model('User', userSchema);

module.exports = User;
