dbCnnection = process.env.DB_MONGO_NAME;
module.exports = {
    mongoURI: dbCnnection,
    PORT: process.env.SERVER_PORT
}