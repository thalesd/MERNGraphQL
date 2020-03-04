const bcrypt = require('bcryptjs');
const { errorHandler } = require('../../helpers/error');

const User = require('../../models/user');

const remapUser = (user) => ({
    ...result._doc,
    password: null
});

module.exports = {
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

    }
}