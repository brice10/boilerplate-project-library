'use strict';

const BookRepository = require('../repositories/BookRepository');

/**
 * A king of interface made to implement all advanced operations 
 * on Books before saving them in database
 */
class BookService {

    BookRepository;

    constructor() {
        this.BookRepository = new BookRepository();
    }

    async find(filter) {
        return await this.BookRepository.find(filter);
    }

    async create(requestBody) {
        if (!requestBody.title)
            return 'missing required field title';

        return await this.BookRepository.create(requestBody)
    }

    async comment(bookId, comment) {
        if (!comment)
            return 'missing required field comment';

        let bookFound = await this.BookRepository.findById(bookId);
        if (!bookFound)
            return 'no book exists';

        bookFound.comments.push(comment);
        bookFound.commentcount++;

        return await this.BookRepository.update(bookFound);
    }

    async delete(id) {
        let documentFound = await this.BookRepository.findById(id)
        if (!documentFound)
            return 'no book exists';

        await this.BookRepository.delete(documentFound._id)
        return 'delete successful';
    }

    async deleteAll() {
        await this.BookRepository.deleteAll();
    }

}

module.exports = BookService;