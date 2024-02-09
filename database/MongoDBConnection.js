'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

// A sample helper class to connect to a MongoDB database
class MongoDBConnection {

    database;
    mongo_uri;

    constructor(mongo_uri, callback) {
        this.mongo_uri = mongo_uri;

        if (!this.mongo_uri) {
            throw new Error('You must provide your MongoDB connection URL');
        }

        mongoose.connect(this.mongo_uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        this.database = mongoose.connection;

        this.database.on("error", (error) => {
            console.error("MongoDB connection error:", error);
            callback();
        });

        this.database.once("open", () => {
            console.log("Connected to MongoDB database");
            callback();
        });
    }

}

module.exports = MongoDBConnection;