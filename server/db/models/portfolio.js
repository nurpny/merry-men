const { DataTypes } = require('sequelize')
const db = require('../db')

const Portfolio = db.define('portfolio', {
  stock: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  }
})


module.exports = Portfolio
