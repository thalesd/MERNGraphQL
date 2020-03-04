const authResolver = require('./auth');
const charactersResolver = require('./characters');
const storiesResolver = require('./stories');

const rootResolver = {
    ...authResolver,
    ...charactersResolver,
    ...storiesResolver
}

module.exports = rootResolver;