require('dotenv').config();
//for db connection and configuration
exports.dbConfig = {
    host: process.env.MONGODB_URI,
    url: process.env.MONGODB_URI,
    dbName: "category-app",
    port: 27017,
};

exports.secretkey = "Your secret key is the heart of your security. Protect it carefully to ensure trust and safety." 