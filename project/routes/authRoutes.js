const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
  register,
  confirmRegister,
  login,
  checkAuthCode,
  deleteAccount,
  kakaoLogin,
  grantAdminRole
} = require('../controllers/authController');

// 회원가입
router.post('/register', register);
router.post('/register/confirm', confirmRegister);

// 카카오 로그인
router.post('/kakao', kakaoLogin);

// 로그인
router.post('/login', login);

// 인증코드 확인
router.get('/check-auth-code', checkAuthCode);

// 회원 탈퇴
router.delete('/', auth, deleteAccount);

// ✅ 관리자 권한 부여 (본인만 가능)
router.put('/grant-admin', auth, grantAdminRole);

module.exports = router;