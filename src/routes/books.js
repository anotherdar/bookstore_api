const express = require('express')
const router = new express.Router()

const {Book} = require('../models/books')
const {isValidToUpdate} = require('../utils/isValidToUpdate')
const {auth} = require('../middleware/auth')
const {paginatedResults} = require('../middleware/pagination')
//add Book
router.post('/book', auth, async (req, res) => {
    const book = new Book({
        ...req.body, 
        book_owner: req.user._id,
    })
    try {
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})
//get books
router.get('/books', auth, async (req, res) => {
    const match = {}                                                          
    const sort = {}                                                           
                                                                              
    if(req.query.sortBy) {                                                    
        const parts = req.query.sortBy.split(':')                             
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1                         
    }            

    try {
        await req.user.populate({
            path: 'books',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.books)
    } catch (error) {
        res.status(500).send(error)
    }
})
//get book by id
router.get('/book/:id',auth, async (req, res) => {
    const id = req.params.id
    try {
        const book = await Book.findOne({_id: id, book_owner: req.user._id})
        if(!book) return res.status(404).send({error: 'Book not found'})
        res.send(book)
    } catch (e) {
        res.status(500).send()
    }
})
//update book 
router.put('/book/:id',auth, async (req, res) => {
    const _id =  req.params.id
    const allowedUpdates = ['book_name', 'book_description', 'book_price', 'book_author']
    const updates = Object.keys(req.body)

    if(!isValidToUpdate(req.body, allowedUpdates)) {
        return res.status(400).send({error: 'the following property does not exist on Book model'})
    }
    try {
        const book = await Book.findOne({_id, book_owner: req.user._id})
        if(!book) return res.status(404).send({error: 'book not found'})
        
        updates.forEach(update => book[update] = req.body[update])
        await book.save(book)

        res.send(book)
    } catch (e) {
        res.status(404).send({error: 'book not found'})
    }
})
//delete by id
router.delete('/book/:id',auth, async(req, res) => {
    const _id = req.params.id
    try {
        const book = await Book.findOneAndDelete({_id, book_owner: req.user._id})

        if(!book) return res.status(404).send({error: 'book not found'})

        res.send({message: 'Book deleted'})
    } catch (error) {
        res.status(500).send()
    }
})

//get all books
router.get('/books/publics',paginatedResults(Book) ,async (req, res) => {
    res.send(res.paginatedResults)
})
//get a public book 
router.get('/book/public/:id', async(req,res) => {
    const _id = req.params.id
    try {
        const book = await Book.findById(_id)
        if(!book) return res.status(404).send({error: 'Book not found'})

        res.send(book)    
    }catch (e) {
        res.status(400).send({error: e.message})
    }
})
module.exports = router