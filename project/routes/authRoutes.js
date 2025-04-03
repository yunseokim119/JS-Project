const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
    register,
    confirmRegister,
    login,
    checkAuthCode,
    deleteAccount,
    kakaoLogin
  } = require('../controllers/authController');

// 회원가입
router.post('/register', register);                 // 이메일 인증코드 발송
router.post('/register/confirm', confirmRegister);  // 인증코드 확인 + 비밀번호 설정

// 카카오 로그인
router.post('/kakao', kakaoLogin);

// 로그인
router.post('/login', login);

// 인증코드 유효성 확인 (선택)
router.get('/check-auth-code', checkAuthCode);

// 회원 탈퇴
router.delete('/', auth, deleteAccount);

module.exports = router;