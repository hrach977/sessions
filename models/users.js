/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   username: {type: String, index: true},
   password: String
});

module.exports = mongoose.model('users', userSchema);