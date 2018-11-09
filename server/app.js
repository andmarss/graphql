const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const config = require('../config');
const cors = require('cors');

const app = express();

// allow cross-origin requests
app.use(cors());

mongoose.connect(`mongodb://${config.login}:${config.password}@ds155823.mlab.com:55823/graphql`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
