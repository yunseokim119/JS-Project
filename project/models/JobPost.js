const { DataTypes } = require('sequelize');
const sequelize = require('../module/database');

const JobPost = sequelize.define('JobPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postedBy: {
    type: DataTypes.INTEGER, // 관리자 유저 ID 저장
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = JobPost;