const router = require('express').Router();
const { Portfolio, Transaction, User } = require('../db/index');

router.post('/transactions', async (req, res, next) => {
  try {
    const { symbol, price, quantity } = req.body;
    const txn = await Transaction.create({
      userId: req.user.id,
      symbol: symbol,
      price: price * 100,
      quantity: quantity
    });
    res.json(txn);
  } catch (err) {
    next(err);
  }
});

router.put('/portfolio', async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;
    const [pftItem, created] = await Portfolio.findOrCreate({
      where: { userId: req.user.id, symbol: symbol },
      defaults: { quantity: quantity }
    });
    if (!created) {
      pftItem.quantity += quantity;
      if (pftItem.quantity === 0) {
        await pftItem.destroy();
      }
      await pftItem.save();
    }
    res.json(pftItem);
  } catch (err) {
    next(err);
  }
});

router.put('/user', async (req, res, next) => {
  try {
    const { marketValue } = req.body;
    const user = await User.findByPk(req.user.id);
    user.cash -= marketValue;
    await user.save();
    res.json(user);
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
