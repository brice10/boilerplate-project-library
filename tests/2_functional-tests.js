/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const BookRepository = require('../database/repositories/BookRepository');

suite('Functional Tests', function () {

  this.timeout(25000);

  const CollectionRepository = new BookRepository();

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: "Sample book"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);

            const resBody = res.body;

            assert.isOk(resBody, 'The response body must be truthy !');
            assert.isOk(resBody._id, '_id attribute must be truthy !');
            assert.isOk(resBody.title, 'title attribute must be truthy !');
            assert.equal(resBody.title, 'Sample book', 'Expected: Sample book, Actual: ' + resBody.title);

            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      this.beforeEach(async function () {
        await CollectionRepository.deleteAll();
      });

      this.afterEach(async function () {
        await CollectionRepository.deleteAll();
      });

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/invalid_id')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        CollectionRepository.create({ title: "Lolo Juice Book" }).then(function (bookSaved) {
          chai
            .request(server)
            .keepOpen()
            .get(`/api/books/${bookSaved._id}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);

              const resBody = res.body;

              assert.isOk(resBody, 'response should be truthy');
              assert.property(resBody, 'commentcount', 'Book should contain commentcount');
              assert.property(resBody, 'comments', 'Book should contain comments');
              assert.property(resBody, 'title', 'Book should contain title');
              assert.property(resBody, '_id', 'Book should contain _id');
              assert.equal(resBody.title, 'Lolo Juice Book', 'Book title should be equals to <Lolo Juice Book>')
              done();
            });
        });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      this.beforeEach(async function () {
        await CollectionRepository.deleteAll();
      });

      this.afterEach(async function () {
        await CollectionRepository.deleteAll();
      });

      test('Test POST /api/books/[id] with comment', function (done) {
        CollectionRepository.create({ title: "Lolo Juice Book" }).then(function (bookSaved) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${bookSaved._id}`)
            .send({ comment: 'Lolo Juice Comment' })
            .end(function (err, res) {
              assert.equal(res.status, 200);

              const resBody = res.body;

              assert.isOk(resBody, 'response should be truthy');
              assert.property(resBody, 'commentcount', 'Book should contain commentcount');
              assert.property(resBody, 'comments', 'Book should contain comments');
              assert.property(resBody, 'title', 'Book should contain title');
              assert.property(resBody, '_id', 'Book should contain _id');

              assert.equal(resBody.comments.length, 1, 'The number of comments on the Book should be equals to 1');
              assert.equal(resBody.commentcount, 1, 'The number of comments on the Book should be equals to 1');
              assert.equal(resBody.comments[0], 'Lolo Juice Comment', 'The Book comment should be <Lolo Juice Comment>')

              done();
            });
        });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        CollectionRepository.create({ title: "Lolo Juice Book" }).then(function (bookSaved) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${bookSaved._id}`)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment');
              done();
            });
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/invalid_id`)
          .send({ comment: 'sample comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      this.beforeEach(async function () {
        await CollectionRepository.deleteAll();
      });

      this.afterEach(async function () {
        await CollectionRepository.deleteAll();
      });

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        CollectionRepository.create({ title: "Lolo Juice Book" }).then(function (bookSaved) {
          chai
            .request(server)
            .keepOpen()
            .delete(`/api/books/${bookSaved._id}`)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');

              CollectionRepository.find({ _id: bookSaved._id }).then(function (list) {
                assert.isArray(list, 'List of books must be an Array');
                assert.equal(list.length, 0, 'List of books must be empty')
                done();
              })
            });
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/invalid_id`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
