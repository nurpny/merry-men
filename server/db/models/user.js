const crypto = require('crypto');
const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        len: [2, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      len: [6, null],
      is: /(?=.*[A-Z])(?=.*[0-9])/i
    },
    salt: {
      type: DataTypes.STRING
    },
    cash: {
      type: DataTypes.INTEGER,
      defaultValue: 5000 * 100,
      validate: {
        min: 0
      }
    }
  },
  {
    defaultScope: {
      attributes: { exclude: ['password', 'salt'] }
    }
  }
);

User.addScope('includeEverything', {
  attributes: { include: ['password', 'salt'] }
});

// Instance methods
User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt) === this.password;
};

// Class methods
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function (userPassword, salt) {
  return crypto
    .createHash('SHA256')
    .update(userPassword)
    .update(salt)
    .digest('hex');
};

User.verifyPassword = async function (userEmail, candidatePwd) {
  const user = await this.scope('includeEverything').findOne({
    where: { email: userEmail }
  });
  if (user.correctPassword(candidatePwd)) {
    let userJSON = { id: user.id, email: user.email, cash: user.cash };
    return userJSON;
  }
};

// Hooks
const setSaltPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
};

User.addHook('beforeCreate', 'beforeUpdate', setSaltPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltPassword);
});

module.exports = User;
