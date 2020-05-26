const { expect } = require('chai');
const { db, User, Transaction, Portfolio } = require('../index');

describe('Models', () => {
  beforeEach(() => {
    return db.sync({ force: true });
  });

  describe('User model', () => {
    describe('validation errors', () => {
      it('throws an error if not valid email', function (done) {
        User.create({
          email: 'james',
          password: '123',
          name: 'james'
        })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('SequelizeValidationError');
            done();
          });
      });

      it('throws an error if not pw does not contain number', function (done) {
        User.create({
          email: 'james',
          password: 'Password',
          name: 'james'
        })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('SequelizeValidationError');
            done();
          });
      });

      it('throws an error if not unique email', function (done) {
        User.create({
          email: 'james@email.com',
          password: 'Password1234',
          name: 'james'
        })
          .then(function () {
            User.create({
              email: 'james@email.com',
              password: 'Password2345',
              name: 'james'
            });
          })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('AssertionError');
            done();
          });
      });
    });

    describe('correct password', () => {
      let james;
      beforeEach(async () => {
        james = await User.create({
          name: 'james',
          email: 'james@gmail.com',
          password: 'Password1234'
        });
      });

      it('returns true if the password is correct', () => {
        expect(james.correctPassword('Password1234')).to.be.equal(true);
      });

      it('returns false if the password is incorrect', () => {
        expect(james.correctPassword('Password12345')).to.be.equal(false);
      });
    });
  });

  describe('Transaction Model', () => {
    describe('validation errors', () => {
      it('throws an error if missing symbol', function (done) {
        Transaction.create({
          quantity: 50,
          price: 1555
        })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('SequelizeValidationError');
            done();
          });
      });
    });
  });

  describe('Portfolio Model', () => {
    describe('validation errors', () => {
      it('throws an error if missing quantity', function (done) {
        Portfolio.create({
          symbol: 'AAPL',
          userId: 1
        })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('SequelizeValidationError');
            done();
          });
      });
    });
    describe('validation errors', () => {
      it('throws an error if negative quantity', function (done) {
        Portfolio.create({
          symbol: 'AAPL',
          userId: 1,
          quantity: -500
        })
          .then(function () {
            expect.fail();
            done();
          })
          .catch(function (err) {
            expect(err['name']).to.be.equal('SequelizeValidationError');
            done();
          });
      });
    });
  });
  describe('Associations', () => {
    let user;
    beforeEach(async () => {
      user = await User.create({
        name: 'james',
        email: 'james@gmail.com',
        password: '1234'
      });
    });

    it('transaction belongs to a user', async () => {
      const transaction = await Transaction.create({
        symbol: 'GOOG',
        quantity: '10',
        price: '140600'
      });

      // this method `setUser` automatically exists if you set up the association correctly
      await transaction.setUser(user);

      const foundTransaction = await Transaction.findByPk(1, {
        include: { model: User }
      });

      expect(foundTransaction.user).to.exist;
      expect(foundTransaction.user.name).to.equal('james');
    });

    it('portfolio belongs to a user', async () => {
      const portfolio = await Portfolio.create({
        symbol: 'GOOG',
        quantity: '10'
      });

      // this method `setUser` automatically exists if you set up the association correctly
      await portfolio.setUser(user);

      const foundArticle = await Portfolio.findByPk(1, {
        include: { model: User }
      });

      expect(foundArticle.user).to.exist;
      expect(foundArticle.user.name).to.equal('james');
    });
  });
});
