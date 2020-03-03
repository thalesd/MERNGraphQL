const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Character = require('./models/character');

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
        }

        type RootQuery {
            characters: [Character!]!
        }

        input characterInput {
            name: String!
            isDevilFruitUser: Boolean!
            isHakiUser: Boolean!
            age: Int
            birthDate: String
        }

        type RootMutation {
            createCharacter(characterInput: characterInput): Character
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
            });

            return newCharacter.save().then(result => {
                console.log('----- DATABASE SAVE SUCCESS -----' + result);
                return {...result._doc }
            }).catch(err => console.log('----- DATABASE SAVE ERROR -----\n' + err));
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