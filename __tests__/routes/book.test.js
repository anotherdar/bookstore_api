const request = require('supertest')
const {app} = require('../../src/app')

const {Book} = require('../../src/models/books')

const {Books, Users,setUpDataBase} = require('../__fixtures__/db')

beforeEach(setUpDataBase)

test('should add a book if the user is auth', async () => {
    const response = await request(app)
        .post('/book')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send({
            book_name: 'how to code',
            book_description: 'A basic book about how to code',
            book_price: 10,
            book_author: 'the coders'
        }).expect(201)
    
    const book = await Book.findById(response.body._id)
    expect(book).not.toBeNull()

    expect(response.body).toMatchObject({
        book_name: 'how to code',
        book_description: 'A basic book about how to code',
        book_price: 10,
        book_author: 'the coders'
    })
})

test('should get all the user books', async () => {
    const response = await request(app)
        .get('/books')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('should get pagination from a users books', async () => {
    await request(app)
        .get('/books?limit=5&skip=0')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)
})

test('should get publics books', async() => {
    const response = await request(app)
        .get('/books/publics')
        .send()
        .expect(200)
    expect(response.body.results.length).toBe(3)
})

test('should get the user book by id', async () => {
    const response = await request(app)
        .get(`/book/${Books[0]._id}`)
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)
    const book = await Book.findById(response.body._id)
    expect(book).not.toBeNull()
})

test('should get public book by id', async () => {
    const response = await request(app)
        .get(`/book/public/${Books[0]._id}`)
        .send()
        .expect(200)
    const book = await Book.findById(response.body._id)
    expect(book).not.toBeNull()
})

test('should update a book from a authenticated user', async () => {
    const response = await request(app)
        .put(`/book/${Books[0]._id}`)
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send({
            book_name: 'By the way of darkness'
        }).expect(200)
    const book = await Book.findById(response.body._id)
    expect(book.book_name).toEqual('By the way of darkness')
})

test('should not update a book if the owner is another user', async() => {
    await request(app)
        .put(`/book/${Books[0]._id}`)
        .set('Authorization', `Bearer ${Users[1].tokens[0].token}`)
        .send({
            book_name: 'In the name of love'
        }).expect(404)
})

test('should not update a book if not authenticated', async() => {
    await request(app)
        .put(`/book/${Books[0]._id}`)
        .send({
            book_name: 'the name'
        }).expect(401)
})