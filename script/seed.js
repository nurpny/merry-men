const { db, User, Transaction, Portfolio } = require('../server/db/index');

const users = require('./users');
const transactions = require('./transactions');
const portfolios = require('./portfolio');

async function runSeed() {
  try {
    await db.sync({ force: true });
    console.log('DB cleaned & synced');

    await Promise.all(users.map((user) => User.create(user)));
    console.log('users created');

    await Promise.all(
      transactions.map((transaction) => Transaction.create(transaction))
    );
    console.log('transactions created');

    await Promise.all(
      portfolios.map((portfolio) => Portfolio.create(portfolio))
    );
    console.log('portfolios created');

    console.log('Seeded successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
    console.log('db connection closed');
  }
}

// execute the seed function
if (module === require.main) {
  runSeed();
}

// export for testing purposes
module.exports = runSeed;
