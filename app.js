const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Character = require('./models/character');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Character {
            _id: ID!
            name: String!
            isDevilFruitUser: Boolean!
            isHakiUser: Boolean!
            age: Int
            birthDate: String
            creator: User
        }

        input characterInput {
            name: String!
            isDevilFruitUser: Boolean!
            isHakiUser: Boolean!
            age: Int
            birthDate: String
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
            createdCharacters: [Character!]
        }

        input userInput {
            email: String!
            password: String!
        }

        type RootQuery {
            characters: [Character!]!
        }
        
        type RootMutation {
            createCharacter(characterInput: characterInput): Character
            createUser(userInput: userInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        characters: () => {
            return Character.find().then(characters => {
                return characters.map(char => {
                    return {...char._doc };
                })
            }).catch(err => console.log('----- DATABASE FETCH ERROR ----- \n' + err));
        },
        createCharacter: ({ characterInput }) => {
            const newCharacter = new Character({
                name: characterInput.name,
                isDevilFruitUser: characterInput.isDevilFruitUser,
                isHakiUser: characterInput.isHakiUser,
                age: characterInput.age,
                birthDate: new Date(characterInput.birthDate),
                creator: '5e5db76913ee4a3f404a10a5'
            });

            let createdCharacter;

            return newCharacter
                .save()
                .then(result => {
                    console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                    createdCharacter = {...result._doc };
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
    },
    graphiql: true
}));

const connectionString = `mongodb+srv://${
    process.env.MONGO_USER
    }:${
    process.env.MONGO_PASSWORD
    }@graphqlmern-app-dtfip.mongodb.net/${
    process.env.MONGO_DB
    }?retryWrites=true&w=majority`

mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => { app.listen(3000) })
    .catch(err => console.log('----- DATABASE CONNECTION ERROR ----- \n' + err))