const { DataTypes } = require('sequelize');
const sequelize = require('../module/database');

const JobPost = sequelize.define('JobPost', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATEONLY, // 마감일
    allowNull: false,
  },
  jobTitle: {
    type: DataTypes.STRING, // 일자리명
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING, // 근무 지역
    allowNull: false,
  },
  field: {
    type: DataTypes.STRING, // 모집 분야
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING, // 첨부파일 URL (선택)
    allowNull: true,
  },
  postedBy: {
    type: DataTypes.INTEGER, // 등록자 (관리자 userId)
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = JobPost;