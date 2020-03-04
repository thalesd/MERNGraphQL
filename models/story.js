const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storySchema = new Schema({
    story: {
        type: String,
        required: true
    },
    characters: [{
        type: Schema.Types.ObjectId,
        ref: 'Character'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Story', storySchema);