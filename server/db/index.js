const db = require('./db')
const User = require('./models/user')
const Transaction = require('./models/transaction')
const Portfolio = require('./models/portfolio')


// Define associations here
User.hasMany(Transaction)
Transaction.belongsTo(User)

User.hasMany(Portfolio)
Portfolio.belongsTo(User)

module.exports = {db}
