const { DataTypes } = require('sequelize');
const sequelize = require('../module/database');

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jobPostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'jobPostId']
    }
  ]
});

module.exports = Like;