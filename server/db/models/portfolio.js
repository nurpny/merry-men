const { DataTypes } = require('sequelize');
const db = require('../db');

const Portfolio = db.define('portfolio', {
  symbol: {
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
      notEmpty: true,
      min: 0
    }
  }
});

module.exports = Portfolio;
