const request = require('supertest')
const { app } = require('../server')
const { expect } = require('chai')
const db = require('../db/db')
const { User } = require('../db/index')

describe('Auth routes', () => {
  before(() => db.sync({ force: true }))

  // tests if signup route creates a new user and sends a json object back of the user.
  describe('POST /signup', () => {
    it('responds with 200 status and json', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send({ name: 'mary', email: 'mary@gmail.com', password: '12345' })
        .set('Accept', 'application/json')
        .expect(200)
      expect(res.body).to.be.an.instanceOf(Object)
    })

    it('creates a new user in the database', async () => {
      const mary = await User.findOne({
        where: { email: 'mary@gmail.com' }
      })
      expect(mary.name).to.equal('mary')
    })
  })
})
