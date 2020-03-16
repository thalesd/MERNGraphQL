const User = require('../../models/user');
const Story = require('../../models/story');
const Character = require('../../models/character');
const { dateToString } = require('../../helpers/date');

const remapCharacter = (char) => ({
    ...char._doc,
    birthDate: char._doc.birthDate ? dateToString(char._doc.birthDate) : char._doc.birthDate,
    creator: user.bind(this, char._doc.creator)
});

const characters = characterIds => {
    return Character.find({ _id: { $in: characterIds } })
        .then(characters =>
            characters.map(char => ({
                ...remapCharacter(char),
                creator: user.bind(this, char._doc.creator)
            }))
        )
};

const remapUser = (user) => ({
    ...user._doc,
    password: null
});

const user = userId => {
    return User.findById(userId)
        .then(userData => ({
            ...userData._doc,
            createdCharacters: characters.bind(this, userData._doc.createdCharacters)
        }));
}

const remapStory = (st) => ({
    ...st._doc,
    user: user.bind(this, st.user),
    characters: characters.bind(this, st.characters),
    createdAt: dateToString(st._doc.createdAt),
    updatedAt: dateToString(st._doc.updatedAt)
});

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
exports.remapCharacter = remapCharacter;
exports.remapUser = remapUser;
exports.remapStory = remapStory;