/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSessionsSchema = new Schema({

    //created: Date, //{type: Date, index: true}
    session: {
        cookie: {
            originalMaxAge: {type: Number},
            expires: {type: Date},
            secure: {type: Boolean},
            httpOnly: {type: Boolean},
            domain: {type: String},
            path: {type: String},
            sameSite: {type: Boolean}
        },
        session_id: String,
        user_id: {type: String, index: true}
    }
    //expires
});

userSessionsSchema.index({created: 1, expireAfterSeconds: 100000});

module.exports = mongoose.model('user_sessions', userSessionsSchema);