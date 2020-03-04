const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../../helpers/error');

const User = require('../../models/user');

const remapUser = (user) => ({
    ...user._doc,
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
    },
    login: ({ email, password }) => {
        return User.findOne({ email: email })
            .then(result => {
                if (!result) {
                    throw new Error("User does not exist.")
                }

                return bcrypt.compare(password, result.password)
                    .then(isEqual => {
                        if (!isEqual) {
                            throw new Error("Incorrect password.");
                        }

                        return jwt.sign({
                            userId: result.id,
                            email: result.email
                        }, 'generatealongsecretlater', {
                            expiresIn: '1h'
                        });
                    })
                    .then(myJwt => ({
                        userId: result.id,
                        token: myJwt,
                        tokenExpiration: 1
                    }))
            })
            .catch(errorHandler)
    }
}