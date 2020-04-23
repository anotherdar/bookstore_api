const request = require('supertest')
const {app} = require('../../src/app')

const {User} = require('../../src/models/user')
const {Users, setUpDataBase} = require('../__fixtures__/db')

beforeEach(setUpDataBase)

test('should sign up a new user', async () => {
    const response = await request(app).post('/auth/signin').send({
        name: 'Juan',
        email: 'juan@mail.com',
        password: 'Red12345$'
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()
    expect(response.body).toMatchObject({
        user: {
            name: 'Juan'
        },
        token: user.tokens[0].token
    })
})

test('should not sign up another user with the same email', async () => {
    await request(app).post('/auth/signin').send(Users[0]).expect(400)
})

test('should log in to the api', async ()=> {
    const response = await request(app).post('/auth/login').send({
        email: Users[0].email,
        password: Users[0].password
    }).expect(200)

    const user = await User.findById(Users[0]._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not log in a user if the credentials are invalid', async () => {
    await request(app).post('/auth/login').send({
        email: 'jojo@mail.com',
        password: Users[0].password
    }).expect(400)
})

test('should log out from the api', async () => {
    await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)
})

test('should log out from all the account', async () => {
    await request(app)
        .post('/auth/logout/all')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)
})