const express = require('express')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const {User } = require('../models/user')
const {Book} = require('../models/books')
const {Cover } = require('../models/cover')

const {auth} = require('../middleware/auth')


const upload = multer({
    limits: {
        fieldSize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
            cb(new Error('File extension not supported. please provide a jpg, jpeg, or png file'))
        }
        cb(undefined, true)
    }
})

router.post('/user/me/avatar', auth ,upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()

    req.user.avatar = buffer

    await req.user.save()
    res.send({message: 'success...'})

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//get avatar 
router.get('/user/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            throw new Error('User not found')
        } else if (!user.avatar) {
            throw new Error('The following user does not contains any avatar')
        }
        

        res.set('Content-type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send({error: error.message})
    }
})

//delete avatar
router.delete('/user/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = null
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


//add cover to a book
router.post('/book/:id/cover', auth, upload.single('cover'), async (req, res) => {
    const _id = req.params.id
    const book = await Book.findOne({_id, book_owner: req.user._id })
    if(!book) throw new Error('Book not found')

    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 350
    }).png().toBuffer()

    const cover = new Cover({book_cover: buffer, book_id: book._id})
    await cover.save()

    res.send({message: 'success...'})

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//get book cover
router.get('/book/:id/cover', async (req, res) => {
    try {
        const book = await Book.findById({_id: req.params.id})
        if(!book) throw new Error('Book not found')

        const cover = await Cover.findOne({book_id: book._id})
        if (!cover) throw new Error('the following book does not contains any cover')
        res.set('Content-Type', 'image/png')
        res.send(cover.book_cover)
    } catch (e) {
        res.status(404).send({error: e.message})
    }
})

//delete book cover 
router.delete('/book/:id/cover', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const book = await Book.findOne({_id, book_owner: req.user._id})

        book.book_cover = null
        await book.save()

        res.send({message: 'success...'})
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports = router