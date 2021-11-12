// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})
const jokes = require('./jokes/jokes-data')
const auth = require('./auth/auth-router')
const request = require('supertest')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

describe('[GET] /', () => {
  test('responds with all the jokes', async () => {
    const res = await request(jokes).get('/jokes')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
  })
})


describe('[POST] /login', () => {
  test('responds with new post', async () => {
    const res = await request(auth)
      .post('/login').send({ username: 'Captain Marvel' })
    expect(res.body).toMatchObject({ id: 1, password: "foobar" })
  })
  test('responds with status 201', async () => {

  })
})

describe('[POST] /register', () => {
  test('responds with new account', async () => {
    const res = await request(auth)
      .post('/login').send({ username: 'Captain Marvel' })
    expect(res.body).toMatchObject({ id: 1, password: "foobar" })
  })
  test('responds with status 201', async () => {

  })
})