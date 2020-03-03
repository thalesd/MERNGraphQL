const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Character {
    _id: ID!
    name: String!
    isDevilFruitUser: Boolean!
    isHakiUser: Boolean!
    age: Int
    birthDate: String
    creator: User!
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
`)