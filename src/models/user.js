const mongoose = require('mongoose')

const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {Book} = require('./books')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,   
        required: true, 
        trim: true,     
        lowercase: true,
        unique: true,   
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('value must be an email')
            }
        }
    },
    password: {
        type: String,
        default: null,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('your pass must not contain the key word password')
            }
        }
    },
    avatar: {
        type: Buffer,
        default: null
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {timestamps: true})
//
userSchema.virtual('books', {  
    ref: 'Book',               
    localField: '_id',         
    foreignField: 'book_owner'      
})                             
//find by credentials 
userSchema.statics.findByCredentials = async (email, password) => {  
    const user = await User.findOne({email: email})                  
    if(!user) throw new Error('Unable to login')                           
                                                                     
    const isMatch = await bcrypt.compare(password, user.password)    
                                                                     
    if(!isMatch) throw new Error('Unable to login')                           
                                                                     
    return user                                                      
}
//generate token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}
//public info
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.avatar
    delete userObject.password

    return userObject
}
//has password
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//delete all user books
userSchema.pre('remove', async function(next) {
    const user = this

    await Book.deleteMany({book_owner: user._id})

    next()
})
const User = mongoose.model('User', userSchema)

module.exports = {
    User
}