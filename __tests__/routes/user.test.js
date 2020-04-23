const request = require('supertest')
const {app} = require('../../src/app')

const {User} = require('../../src/models/user')
const {Users, setUpDataBase} = require('../__fixtures__/db')

beforeEach(setUpDataBase)

test('should get user profile', async () => {
    const response = await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body).toMatchObject({
        name: Users[0].name,
        email: Users[0].email
    })
})

test('should get public profile from a user', async () => {
    const response = await request(app)
        .get(`/user/${Users[0]._id}`)
        .send()
        .expect(200)
    
    expect(response.body).toMatchObject({
        name: Users[0].name,
        email: Users[0].email
    })
})

test('should delete the user account if the user is authenticated', async () => {
    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not delete the user account if the user is not auth', async () => {
    await request(app)
        .delete('/user/me')
        .send()
        .expect(401)
})

test('should update valid user fields', async () => {
    await request(app)
        .put('/user/me')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send({
            name: "Jhon"
        })
    
    const user = await User.findById(Users[0]._id)
    expect(user.name).toEqual('Jhon')
})

test('should not update a user if the user is not auth', async () => {
    await request(app)
        .put('/user/me')
        .send({
            name: 'Juan'
        }).expect(401)
})

test('should only update valid users fields', async () => {
    await request(app)
        .put('/user/me')
        .set('Authorization', `Bearer ${Users[0].tokens[0].token}`)
        .send({
            location: 'Philadelphia'
        }).expect(400)
})