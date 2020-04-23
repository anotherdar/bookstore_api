const express = require('express')
const router = new express.Router()

const {User} = require('../models/user')
const { auth } = require('../middleware/auth')

//sign in
router.post('/auth/signin', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch(e) {
        res.status(400).send(e)
    }
})

//log in
router.post('/auth/login', async (req, res) => {                                   
    try {                                                                          
        const user = await User.findByCredentials(req.body.email, req.body.password)                                                                                  
        const token = await user.generateAuthToken()                               
                                                                                   
        res.send({  
            token                                                                  
        })                                                                         
                                                                                   
    } catch(e) { 
        res.status(400).send({error: e.message})                                                   
    }                                                                              
})                                                                                 

//log out 
router.post('/auth/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(({token}) => token !== req.token)        

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//logout all 
router.post('/auth/logout/all', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({message: '...'})
    } catch (e) {
        res.status(500).send({error: '...'})
    }
   
})

module.exports = router