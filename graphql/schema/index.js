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

type Story {
    _id: ID!
    story: String!
    characters: [Character!]
    user: User!
    createdAt: String!
    updatedAt: String! 
}

input storyInput {
    story: String!
    characterIds: [ID!]
    userId: ID!
}

type RootQuery {
    characters: [Character!]
    stories: [Story!]
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