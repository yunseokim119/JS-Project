const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 비밀번호 재설정 (비로그인 상태에서도 사용 가능)
router.post('/change-password/request', userController.requestPasswordReset);
router.post('/change-password/confirm', userController.confirmPasswordReset);

module.exports = router;