const { DataTypes } = require('sequelize');
const sequelize = require('../module/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  authState: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: -1,
  },
}, {
  timestamps: true,
});

module.exports = User;