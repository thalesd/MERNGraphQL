const bcrypt = require('bcryptjs');

const Character = require('../../models/character');
const User = require('../../models/user');
const Story = require('../../models/story')

const characters = characterIds => {
    return Character.find({ _id: { $in: characterIds } })
        .then(characters =>
            characters.map(char => ({
                ...remapCharacter(char),
                creator: user.bind(this, char._doc.creator)
            }))
        )
}

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

//Object Remappers
const remapStory = (st) => ({
    ...st._doc,
    user: user.bind(this, st.user),
    characters: characters.bind(this, st.characters),
    createdAt: new Date(st._doc.createdAt).toISOString(),
    updatedAt: new Date(st._doc.updatedAt).toISOString()
});

const remapCharacter = (char) => ({
    ...char._doc,
    birthDate: new Date(char._doc.birthDate).toISOString(),
    creator: user.bind(this, char._doc.creator)
});

const remapUser = (user) => ({
    ...result._doc,
    password: null
});

const errorHandler = (err) => {
    throw err;
}

module.exports = {
    stories: () => {
        return Story.find()
            .then(stories => {
                return stories.map(st => remapStory(st));
            })
            .catch(err => { console.log('----- DATABASE FETCH ERROR ----- \n' + err) })
            .catch(errorHandler)
    },
    characters: () => {
        return Character
            .find()
            .then(characters => {
                return characters.map(char => remapCharacter(char))
            })
            .catch(err => { console.log('----- DATABASE FETCH ERROR ----- \n' + err) })
            .catch(errorHandler);
    },
    createCharacter: ({ characterInput }) => {
        const newCharacter = new Character({
            name: characterInput.name,
            isDevilFruitUser: characterInput.isDevilFruitUser,
            isHakiUser: characterInput.isHakiUser,
            age: characterInput.age,
            birthDate: new Date(characterInput.birthDate).toISOString(),
            creator: '5e5db76913ee4a3f404a10a5'
        });

        let createdCharacter;

        return newCharacter
            .save()
            .then(result => {
                console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                createdCharacter = remapCharacter(result);
                return User.findById('5e5db76913ee4a3f404a10a5')
            })
            .then(user => {
                if (!user) {
                    throw new Error("User not found.")
                }
                user.createdCharacters.push(newCharacter);
                return user.save();
            })
            .then((updateResult) => {
                console.log('----- DATABASE UPDATE SUCCESS ----- \n' + updateResult);
                return createdCharacter
            })
            .catch(err => { console.log('----- DATABASE SAVE ERROR -----\n' + err) })
            .catch(errorHandler);
    },
    createUser: ({ userInput }) => {
        return User.findOne({ email: userInput.email })
            .then(user => {
                if (user) {
                    throw new Error("User aready exists.")
                }

                return bcrypt.hash(userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: userInput.email,
                    password: hashedPassword
                })

                return user.save()
                    .catch(err => { console.log('----- DATABASE SAVE ERROR -----\n' + err) });
            })
            .then(result => {
                console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                return remapUser(result);
            })
            .catch(err => {
                console.log('----- PASSWORD HASHING ERROR -----\n' + err);
            })
            .catch(errorHandler);

    },
    createStory: ({ storyInput }) => {
        const newStory = new Story({
            story: storyInput.story,
            characters: storyInput.characterIds,
            user: storyInput.userId
        })

        return newStory.save()
            .then(result => {
                console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                return remapStory(result);
            })
            .catch(err => { console.log('----- DATABASE SAVE ERROR -----\n' + err) })
            .catch(errorHandler);
    },
    deleteStory: ({ storyId }) => {
        let storyObject;

        return Story.findById(storyId)
            .then(result => {
                return Story.deleteOne({ _id: result.id })
                    .then(deleteResult => {
                        console.log('----- DATABASE DELETE SUCCESS -----' + deleteResult)
                        return remapStory(result);
                    })
            })
            .catch(errorHandler)
    }
}