const request = require('supertest')
const {app} = require('../../src/app')

const {User} = require('../../src/models/user')
const {Book} = require('../../src/models/books')

const {Users, Books, setUpDataBase} = require('../__fixtures__/db')

beforeEach(setUpDataBase)

describe('Avatar', () => {

    it('should upload a avatar photo if the user is auth', async () => {
        await request(app)
            .post('/user/me/avatar')
            .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
            .attach('avatar', '__tests__/__fixtures__/profile-pic.jpg')
            .expect(200)
        
        const user = await User.findById(Users[0]._id)
        expect(user.avatar).toEqual(expect.any(Buffer))
        
    })

    it('should delete the avatar photo', async () => {
        await request(app)
            .delete('/user/me/avatar')
            .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
            .send()
            .expect(200)
    })
    it('should not delete an avatar photo if the user is not auth', async () => {
        await request(app)
            .delete('/user/me/avatar')
            .send()
            .expect(401)
    })
})

describe('book cover', () => {
    it('should upload a cover photo to a book', async() => {
        await request(app)
            .post(`/book/${Books[0]._id}/cover`)
            .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
            .attach('cover', '__tests__/__fixtures__/philly.jpg')
            .expect(200)
        const book = await Book.findById(Books[0]._id)
        expect(book.book_cover).toEqual(expect.any(Buffer))
    })
    it('should not upload a cover photo to a book if the owner is not auth', async() => {
        await request(app)
            .post(`/book/${Books[0]._id}/cover`)
            .attach('cover', '__tests__/__fixtures__/philly.jpg')
            .expect(401)
    })
    
    it('should delete a book cover if the user is auth', async () => {
        await request(app)
            .delete(`/book/${Books[0]._id}/cover`)
            .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
            .send()
            .expect(200)
    })
    it('should not delete a book cover if the user is auth', async () => {
        await request(app)
            .delete(`/book/${Books[0]._id}/cover`)
            .send()
            .expect(401)
    })
    
})
