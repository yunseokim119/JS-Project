const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/jobPostController');

// 공고 전체 조회 (로그인 필요 없음)
router.get('/', jobPostController.getAllJobPosts);

// 공고 단건 조회
router.get('/:id', jobPostController.getJobPostById);

// 공고 등록 (관리자용)
router.post('/', jobPostController.createJobPost);

// 공고 수정 (관리자용)
router.put('/:id', jobPostController.updateJobPost);

// 공고 삭제 (관리자용)
router.delete('/:id', jobPostController.deleteJobPost);

module.exports = router;