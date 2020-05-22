const router = require('express').Router()
const { Portfolio, Transaction, User } = require('../db/index')


router.post('/transactions', async (req, res, next) => {
  try {
    const { userId, symbol, price, quantity } = req.body
    const txn = await Transaction.create({
      userId: userId,
      symbol: symbol,
      price: price*100,
      quantity: quantity
    })
    res.json(txn)
  } catch (err) {
    next(err)
  }
})

router.put('/portfolio', async (req, res, next) => {
  try {
    const { userId, symbol, quantity } = req.body
    const [pftItem, created] = await Portfolio.findOrCreate({
      where: { userId: userId, symbol: symbol },
      defaults: { quantity: quantity }
    })
    if (!created) {
      pftItem.quantity += quantity
      if (pftItem.quantity === 0) {
        await pftItem.destroy();
      }
      await pftItem.save();
    }
    res.json(pftItem);
  } catch (err) {
    next(err)
  }
})


router.put('/user', async (req, res, next) => {
  try {
    const { userId, marketValue } = req.body
    const user = await User.findByPk(userId);
    user.cash -= marketValue;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err)
  }
})


router.get('/portfolio/:userId', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { userId: req.params.userId }
    })
    res.json(portfolio)
  } catch (err) {
    next(err)
  }
})


router.get('/transactions/:userId', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

module.exports = router
