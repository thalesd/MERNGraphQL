const { dateToString } = require('../../helpers/date');
const { errorHandler } = require('../../helpers/error');

const Character = require('../../models/character');
const User = require('../../models/user');

const { remapCharacter } = require('./mergers');

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

        if (characterInput.birthDate.trim() > 0) characterInput.birthDate = dateToString(characterInput.birthDate);

        const newCharacter = new Character({
            name: characterInput.name,
            hasPowers: characterInput.hasPowers,
            powerDescription: characterInput.powerDescription,
            age: characterInput.age,
            birthDate: characterInput.birthDate,
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