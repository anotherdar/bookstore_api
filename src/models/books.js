const mongoose = require('mongoose')

const booksSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true
    },
    book_author: {
        type: String,
        required: true
    },
    book_price: {
        type: Number,
        default: 0
    },
    book_description: {
        type: String,
        default: 'No description added'
    },
    book_cover: {
        type: Buffer,
        default: null
    },
    book_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{timestamps: true})

booksSchema.methods.toJSON = function() {
    const book = this
    const bookObject = book.toObject()

    delete bookObject.book_cover

    return bookObject
}

const Book = mongoose.model('Book', booksSchema)

module.exports = {
    Book
}