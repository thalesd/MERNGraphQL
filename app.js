const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const characters = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Character {
            _id: ID!
            name: String!
            isDemonFruitUser: Boolean!
            isHakiUser: Boolean!
            age: Int
            birthDate: String
        }

        type RootQuery {
            characters: [Character!]!
        }

        input characterInput {
            name: String!
            isDemonFruitUser: Boolean!
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
            return characters;
        },
        createCharacter: ({ characterInput }) => {
            const newCharacter = {
                _id: Math.floor(1000 * Math.random()).toString(),
                ...characterInput
            }

            characters.push(newCharacter);

            return newCharacter;
        }
    },
    graphiql: true
}));

app.listen(3000);