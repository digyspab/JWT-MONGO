const mongoose = require('mongoose');
const mongoKeys = require('./keys');

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(mongoKeys.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database....');
    } catch(e) {
        console.log(e);
        throw e;
    }
}

module.exports = InitiateMongoServer;