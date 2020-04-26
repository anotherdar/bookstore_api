const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

require('./db/mongoose')

const bookRoute = require('./routes/books')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const filesImagesRoutes = require('./routes/images')
const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    try {
        res.send({message: 'welcome to bookstore api'})
    } catch (e) {   
        res.status(500).send({error: 'server error'})
    }
})

app.use(bookRoute)
app.use(userRoute)
app.use(authRoute)
app.use(filesImagesRoutes)

module.exports = {
    app
}