const express = require('express');
const router = express.Router();
const {
  register,
  confirmRegister,
  login,
  checkAuthCode,
} = require('../controllers/authController');

router.post('/register', register);          // 이메일 등록 + 인증코드 전송
router.post('/register/confirm', confirmRegister); // 인증코드 확인 + 비밀번호 설정
router.post('/login', login);
router.get('/check-auth-code', checkAuthCode);

module.exports = router;