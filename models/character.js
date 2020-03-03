const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isDevilFruitUser: {
        type: Boolean,
        required: true
    },
    isHakiUser: {
        type: Boolean,
        required: true
    },
    age: {
        type: Number
    },
    birthDate: {
        type: Date
    }
});

module.exports = mongoose.model('Character', characterSchema);