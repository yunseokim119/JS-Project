const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const likeRoutes = require('./routes/likeRoutes');
const viewRoutes = require('./routes/viewRoutes');

const sequelize = require('./module/database');
const User = require('./models/User');
const JobPost = require('./models/JobPost');
const View = require('./models/View');
const Like = require('./models/Like');

const app = express();

// ✅ JSON, URL-encoded 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/jobposts/view', viewRoutes);

// ✅ 모델 관계 설정
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(JobPost, { foreignKey: 'jobPostId' });
User.hasMany(Like, { foreignKey: 'userId' });
JobPost.hasMany(Like, { foreignKey: 'jobPostId' });

View.belongsTo(User, { foreignKey: 'userId' });
View.belongsTo(JobPost, { foreignKey: 'jobPostId' });
User.hasMany(View, { foreignKey: 'userId' });
JobPost.hasMany(View, { foreignKey: 'jobPostId' });

// ✅ 라우터 등록
app.use('/api/auth', authRoutes);
app.use(userRoutes);
app.use('/api/jobposts', jobPostRoutes);
app.use('/api/jobposts/like', likeRoutes);

// ✅ DB 연결 및 서버 실행
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL 연결 성공');
    return sequelize.sync(); // force: true 필요 없음
  })
  .then(() => {
    console.log('✅ 테이블 동기화 완료');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB 연결 또는 테이블 동기화 실패:', err);
  });