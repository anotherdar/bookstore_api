const mongoose = require('mongoose')
const {Cover} = require('./cover')

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
    book_owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    book_cover: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Cover'
    }
},{timestamps: true, toJSON: {
    virtuals: true
}})
booksSchema.virtual('book_cover_url', {
    ref: 'Cover',               
    localField: '_id',         
    foreignField: 'book_id' 
})


const Book = mongoose.model('Book', booksSchema)

module.exports = {
    Book
}