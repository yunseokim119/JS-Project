const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const likeController = require('../controllers/likeController');

// ✅ 좋아요 토글
router.post('/toggle/:jobPostId', auth, likeController.toggleLike);

// ✅ 내가 좋아요 누른 공고 목록 조회
router.get('/my-likes', auth, likeController.getMyLikes);

module.exports = router;