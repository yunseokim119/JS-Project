const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./module/database');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(userRoutes);

// DB 연결 테스트
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL 연결 성공');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ 테이블 동기화 완료');
    // 여기서 서버 시작
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB 연결 또는 테이블 동기화 실패:', err);
  });