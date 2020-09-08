const router = require('express').Router();

const { Portfolio, Transaction, User, db } = require('../db/index');

router.post('/transactions', async (req, res, next) => {
  try {
    const { symbol, price, quantity } = req.body;
    // managed transactions in sequelize will rollback the transaction if any single error thrown
    // https://sequelize.org/master/manual/transactions.html

    await db.transaction(async (t) => {
      // first record a transaction
      const txn = await Transaction.create(
        {
          userId: req.user.id,
          symbol: symbol,
          price: price,
          quantity: quantity
        },
        { transaction: t }
      );

      // update the user
      const user = await User.findByPk(req.user.id, { transaction: t });
      user.cash -= quantity * price;
      await user.save({ transaction: t });

      // update the portfolio
      const [pftItem, created] = await Portfolio.findOrCreate({
        where: { userId: req.user.id, symbol: symbol },
        defaults: { quantity: quantity },
        transaction: t
      });
      if (!created) {
        pftItem.quantity += quantity;
        if (pftItem.quantity === 0) {
          await pftItem.destroy({ transaction: t });
        } else {
          await pftItem.save({ transaction: t });
        }
      }
      res.json({ txn: txn, pftItem: pftItem, user: user });
    });
  } catch (err) {
    next(err);
  }
});

router.get('/portfolio/', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { userId: req.user.id },
      order: [['symbol', 'ASC']]
    });
    res.json(portfolio);
  } catch (err) {
    next(err);
  }
});

router.get('/transactions/', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
