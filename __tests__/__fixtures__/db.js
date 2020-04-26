const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const {User} = require('../../src/models/user')
const {Book} = require('../../src/models/books')

const userOneId = new mongoose.Types.ObjectId()
const userOne  = {
    _id: userOneId,
    name: 'Dio Brando',
    email: 'diobrando@mail.com',
    password: 'Red1234@#!',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoID = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoID,
    name: 'Joseph Jostar',
    email: 'jojo22@mail.com',
    password: 'masaka125@3',
    tokens: [{
        token: jwt.sign({_id: userTwoID}, process.env.JWT_SECRET)
    }]
}

const bookOne = {
    _id: new mongoose.Types.ObjectId(),
    book_name: 'Tha book',
    book_author: 'me',
    book_price: 150,
    book_description: 'a book about me',
    book_cover: null,
    book_owner: userOneId
}
const bookTwo = {
    _id: new mongoose.Types.ObjectId(),
    book_name: 'Tha book',
    book_author: 'me plus 2',
    book_price: 150,
    book_description: 'a book about me',
    book_cover: null,
    book_owner: userOneId
}
const bookThree = {
    _id: new mongoose.Types.ObjectId(),
    book_name: 'Tha book',
    book_author: 'two plus two four',
    book_price: 150,
    book_description: 'a book about me',
    book_cover: null,
    book_owner: userTwoID
}

const Users = [
    userOne, 
    userTwo
]

const Books = [
    bookOne,
    bookTwo,
    bookThree
]
const setUpDataBase = async () => {
    await User.deleteMany({})
    Users.forEach(async user => {
        await new User(user).save()
    })

    await Book.deleteMany({})
    Books.forEach(async (book) => {
        await new Book(book).save()
    })
}


module.exports = {
    Books,
    Users,
    setUpDataBase
}

test('not a test', () => {
    console.log('running')
})