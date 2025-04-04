const { DataTypes } = require('sequelize');
const sequelize = require('../module/database');
const User = require('./User');
const JobPost = require('./JobPost');

const View = sequelize.define('View', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  jobPostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: JobPost,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

module.exports = View;