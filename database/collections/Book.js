'use strict';

const mongoose = require('mongoose');

// MongoDB collection for Books
class Book {
    static _model;

    constructor(collectionName) {
        this._collectionName = collectionName || 'Book';
        this._model = mongoose.model(this._collectionName, this._schema);
    }

    _schema = new mongoose.Schema({
        _id: {
            type: String
        },
        title: {
            type: String,
            require: true
        },
        comments: [ String ],
        commentcount: { 
            type: Number,
            default: 0
        }
    })
}

module.exports = Book;