const express = require('express')
const router = new express.Router()

const {User} = require('../models/user')
const { auth } = require('../middleware/auth')

const {isValidToUpdate} = require('../utils/isValidToUpdate')
//get user
router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})
router.get('/user/:id', async(req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)

        if(!user) return res.status(404).send({error: 'user not found'})

        res.send(user)
    } catch (error) {
        req.status(400).send({error})
    }
})
//update user
router.put('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']

    if(!isValidToUpdate(req.body, allowedUpdates)) {
        return res.status(400).send({error: 'Invalid update, the following property does not exit on user'})
    }
    
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])

        await user.save()
        res.send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

//delete user
router.delete('/user/me', auth, async (req, res) => {
    try {
        await req.user.remove()

        res.send({message: 'account deleted'})
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router