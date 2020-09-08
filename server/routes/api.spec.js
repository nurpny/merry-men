const request = require('supertest');
const { app } = require('../server');
const { expect } = require('chai');
const db = require('../db/db');
const { User, Transaction, Portfolio } = require('../db/index');

async function createUsers() {
  await User.create({
    id: 1,
    email: 'mary@gmail.com',
    password: 'PW1234',
    name: 'mary'
  });
  await User.create({
    id: 2,
    email: 'nomoney@email.com',
    password: 'PW1234',
    name: 'nomoney',
    cash: 0
  });
}

async function createTxn() {
  await Transaction.create({
    symbol: 'SPOT',
    quantity: 20,
    price: 190,
    userId: 1
  });
  await Transaction.create({
    symbol: 'GOOG',
    quantity: 1,
    price: 1400,
    userId: 1
  });
}

async function createPft() {
  await Portfolio.create({
    symbol: 'FB',
    quantity: 2,
    userId: 1
  });
  await Portfolio.create({
    symbol: 'NFLX',
    quantity: 2,
    userId: 1
  });
}

const userCredentials = {
  email: 'mary@gmail.com',
  password: 'PW1234'
};

describe('API routes', () => {
  before(() => db.sync({ force: true }));

  // logging in with the user before any tests
  let authenticatedUser = request.agent(app);

  before(async () => {
    await createUsers();
    await createTxn();
    await createPft();
    await authenticatedUser.post('/auth/login').send(userCredentials);
  });

  describe('GET /transactions', () => {
    // making a new request to the route with unauthenticatedUser should result in a 500 response
    it('returns a 500 response if the user is not logged in', async () => {
      const res = await request(app).get('/api/transactions');
      expect(res.status).to.equal(500);
    });

    // if the user is logged in we should get a 200 status code
    // and expect transactions created in createTxn
    it('returns a 200 status with json response if the user is logged in', async () => {
      const res = await authenticatedUser.get('/api/transactions');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      expect(res.body.map((txn) => txn.symbol)).to.include.members([
        'SPOT',
        'GOOG'
      ]);
    });
  });

  describe('GET /portfolio', () => {
    // making a new request to the route with unauthenticatedUser should result in a 500 response
    it('returns a 500 response if the user is not logged in', async () => {
      const res = await request(app).get('/api/transactions');
      expect(res.status).to.equal(500);
    });

    // if the user is logged in we should get a 200 status code
    // and expect portfolio created in createPft
    it('returns a 200 status with json response if the user is logged in', async () => {
      const res = await authenticatedUser.get('/api/portfolio');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      expect(res.body.map((pft) => pft.symbol)).to.include.members([
        'FB',
        'NFLX'
      ]);
    });
  });

  describe('POST /transactions', () => {
    // making a new request to the route with unauthenticatedUser should result in a 500 response
    it('returns a 500 response if the user is not logged in', async () => {
      const res = await request(app).post('/api/transactions');
      expect(res.status).to.equal(500);
    });

    // if the user is logged in we should get a 200 status code
    // and expect response to be a transaction object
    it('returns a 200 status with json response if the user is logged in', async () => {
      const res = await authenticatedUser
        .post('/api/transactions')
        .send({ symbol: 'JPM', price: 8944, quantity: 7 });
      expect(res.status).to.equal(200);
      expect(res.body.txn.symbol).to.equal('JPM');
      expect(res.body.pftItem.symbol).to.equal('JPM');
      expect(res.body.pftItem.quantity).to.equal(7);
      expect(res.body.user.cash).to.equal(437392);
      expect(res.body).to.be.an.instanceOf(Object);
    });

    it('creates a transaction in the database', async () => {
      const txn = await Transaction.findAll({
        where: { userId: 1 }
      });
      expect(txn.map((txn) => txn.symbol)).to.include('JPM');
    });

    it('updates the portfolio in the database', async () => {
      const pft = await Portfolio.findOne({
        where: { symbol: 'JPM' }
      });
      expect(pft.quantity).to.equal(7);
    });

    it('updates the user in the database', async () => {
      const user = await User.findByPk(1);
      expect(user.cash).to.equal(437392);
    });

    it('if one transaction fails all should fail', async () => {
      const errorUser = {
        email: 'nomoney@email.com',
        password: 'PW1234'
      };
      await authenticatedUser.post('/auth/login').send(errorUser);
      const res = await authenticatedUser
        .post('/api/transactions')
        .send({ symbol: 'SPOT', price: 24821, quantity: 2 });
      expect(res.status).to.equal(500);
      const txn = await Transaction.findAll({
        where: { userId: 2 }
      });
      expect(txn.map((txn) => txn.symbol)).to.not.include('SPOT');
    });
  });
});
