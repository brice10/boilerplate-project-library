/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookService = require('../database/services/BookService');
const BookServiceHelper = new BookService();

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        let filter = req.query;
        return res.json(await BookServiceHelper.find(filter));
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to get Books list in the database', data: error })
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      try {
        const response = await BookServiceHelper.create({ title: title });
        return typeof response === 'string'
          ? res.type('txt').send(response + '')
          : res.json(response);
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to create a Book in the database', data: error })
      }
    })

    .delete(async function (req, res) {
      try {
        await BookServiceHelper.deleteAll();
        return res.type('txt').send('complete delete successful');
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Unknown error when trying to delete all the Books in the database', data: error })
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      try {
        const response = await BookServiceHelper.find({ _id: bookid });
        return response && response.length > 0
          ? res.json(response[0])
          : res.type('txt').send('no book exists');
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: `Unknown error when trying to get Book with id ${bookid} in the database`, data: error })
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      try {
        const response = await BookServiceHelper.comment(bookid, comment);
        return typeof response === 'string'
          ? res.type('txt').send(response)
          : res.json(response);
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: `Unknown error when trying to comment a Book in the database`, data: error })
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const response = await BookServiceHelper.delete(bookid);
        return typeof response === 'string'
          ? res.type('txt').send(response)
          : res.json(response);
      }
      catch (error) {
        console.log(error)
        return res.status(500).json({ error: `Unknown error when trying to delete the Book in the database`, data: error })
      }
    });

};
