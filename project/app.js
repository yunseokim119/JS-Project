const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');

const sequelize = require('./module/database');
const User = require('./models/User');
const JobPost = require('./models/JobPost');

const app = express();

// ✅ 일반적인 JSON, URL-encoded 파싱만 적용 (multer가 multipart/form-data 처리함)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 라우터 등록
app.use('/api/auth', authRoutes);
app.use(userRoutes);
app.use('/api/jobposts', jobPostRoutes);

// ✅ DB 연결 및 서버 실행
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL 연결 성공');
    return sequelize.sync({ alter: true });
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