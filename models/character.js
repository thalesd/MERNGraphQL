const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    hasPowers: {
        type: Boolean,
        required: true
    },
    powerDescription: {
        type: String,
        required: false
    },
    age: {
        type: Number
    },
    birthDate: {
        type: Date
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Character', characterSchema);