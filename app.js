const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

//middlewares
const isAuth = require('./middlewares/isAuth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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