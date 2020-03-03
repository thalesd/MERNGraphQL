const bcrypt = require('bcryptjs');

const Character = require('../../models/character');
const User = require('../../models/user');

const characters = characterIds => {
    return Character.find({ _id: { $in: characterIds } })
        .then(characters =>
            characters.map(char => ({
                ...char._doc,
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

module.exports = {
    characters: () => {
        return Character
            .find()
            .then(characters => {
                return characters.map(char => ({
                    ...char._doc,
                    birthDate: new Date(char._doc.birthDate).toISOString(),
                    creator: user.bind(this, char._doc.creator)
                }))
            })
            .catch(err => console.log('----- DATABASE FETCH ERROR ----- \n' + err));
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
                createdCharacter = {...result._doc, creator: user.bind(this, result._doc.creator) };
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
            .catch(err => console.log('----- DATABASE SAVE ERROR -----\n' + err));
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
                return {...result._doc, password: null }
            })
            .catch(err => {
                console.log('----- PASSWORD HASHING ERROR -----\n' + err);
                throw err;
            });

    }
}