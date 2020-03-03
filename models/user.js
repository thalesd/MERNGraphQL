const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdCharacters: [{
        type: Schema.Types.ObjectId,
        ref: 'Character'
    }]
});

module.exports = mongoose.model('User', userSchema);