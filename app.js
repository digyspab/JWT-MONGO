require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const keys = require('./config/keys');
const InitiateMongoServer = require('./config/db');
const user = require('./routes/user');


InitiateMongoServer();

const app = express();

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.json({
        message: "App is running",
    });
});

app.use('/user', user);


app.listen(keys.PORT, () => {
    console.log(`Server is runnig on PORT: ${keys.PORT}`);
});