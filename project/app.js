const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // .env 파일 불러오기

const app = express();

app.use(express.json()); // JSON 파싱 미들웨어
app.use('/api/auth', authRoutes); // 인증 라우터

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});