const User = require('../../models/user');
const Story = require('../../models/story');
const Character = require('../../models/character');

const characters = characterIds => {
    return Character.find({ _id: { $in: characterIds } })
        .then(characters =>
            characters.map(char => ({
                ...remapCharacter(char),
                creator: user.bind(this, char._doc.creator)
            }))
        )
};

const user = userId => {
    return User.findById(userId)
        .then(userData => ({
            ...userData._doc,
            createdCharacters: characters.bind(this, userData._doc.createdCharacters)
        }));
}

const story = storyId => {
    return Story.findById(storyId)
        .then(storyData => ({
            ...remapStory(storyData),
            user: user.bind(this, storyData.user),
            characters: characters.bind(this, storyData.characters)
        }))
}

exports.characters = characters;
exports.user = user;
exports.story = story;