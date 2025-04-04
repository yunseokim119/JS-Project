const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const viewController = require('../controllers/viewController');

// ✅ 내가 조회한 공고 목록
router.get('/my-views', auth, viewController.getMyViews);

module.exports = router;