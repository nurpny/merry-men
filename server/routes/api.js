const router = require('express').Router()
const { Portfolio, Transaction } = require('../db/index')

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

module.exports = router
