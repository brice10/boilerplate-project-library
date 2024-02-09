'use strict';

const Book = require('../collections/Book');
const mongoose = require('mongoose');

/**
 * A king of interface made to implement all Basics operations 
 * on Books in database
 */
class BookRepository {
    static model = new Book()._model;

    constructor() { }

    async find(filter) {
        return await BookRepository.model.find(filter);
    }

    async create(item) {
        item._id = new mongoose.Types.ObjectId();
        item.commentcount = 0;
        item.comments = [];
        return await (new BookRepository.model(item)).save();
    }

    async update(item) {
        item.markModified('comments');
        return await (new BookRepository.model(item)).save();
    }

    async delete(_id) {
        return await BookRepository.model.findByIdAndDelete(_id);
    }

    async deleteAll() {
        return await BookRepository.model.deleteMany({});
    }

    async findById(_id) {
        return await BookRepository.model.findById(_id);
    }

}

module.exports = BookRepository;