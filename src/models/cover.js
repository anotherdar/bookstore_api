const mongoose = require('mongoose')

const coverSchema = new mongoose.Schema({
    book_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    book_cover: {
        type: Buffer,
        required: true
    }
}, {timestamps: true})

const Cover = mongoose.model('Cover', coverSchema)

module.exports = {
    Cover
}