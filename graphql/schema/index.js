const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Character {
    _id: ID!
    name: String!
    hasPowers: Boolean!
    powerDescription: String
    age: Int
    birthDate: String
    creator: User!
}

input characterInput {
    name: String!
    hasPowers: Boolean!
    powerDescription: String
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

type Story {
    _id: ID!
    story: String!
    characters: [Character!]
    createdAt: String!
    updatedAt: String! 
}

input storyInput {
    story: String!
    characterIds: [ID!]
    userId: ID!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type RootQuery {
    characters: [Character!]
    stories: [Story!]
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createCharacter(characterInput: characterInput): Character
    createUser(userInput: userInput): User
    createStory(storyInput: storyInput): Story!
    deleteStory(storyId: ID!): Story!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)