const { dateToString } = require('../../helpers/date');
const { errorHandler } = require('../../helpers/error');

const { user } = require('./mergers');

const Character = require('../../models/character');
const User = require('../../models/user');

const remapCharacter = (char) => ({
    ...char._doc,
    birthDate: dateToString(char._doc.birthDate),
    creator: user.bind(this, char._doc.creator)
});

module.exports = {
    characters: () => {
        return Character
            .find()
            .then(characters => {
                return characters.map(char => remapCharacter(char))
            })
            .catch(err => { console.log('----- DATABASE FETCH ERROR ----- \n' + err) })
            .catch(errorHandler);
    },
    createCharacter: ({ characterInput }, req) => {
        if (!req.isAuth) {
            throw new Error("User not Authenticated!");
        }

        const newCharacter = new Character({
            name: characterInput.name,
            isDevilFruitUser: characterInput.isDevilFruitUser,
            isHakiUser: characterInput.isHakiUser,
            age: characterInput.age,
            birthDate: dateToString(characterInput.birthDate),
            creator: req.userId
        });

        let createdCharacter;

        return newCharacter
            .save()
            .then(result => {
                console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                createdCharacter = remapCharacter(result);
                return User.findById(req.userId)
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
    }
}