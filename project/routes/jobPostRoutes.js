const express = require('express');
const router = express.Router();
const upload = require('../module/upload');
const jobPostController = require('../controllers/jobPostController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


// ✅ 공고 전체 조회
router.get('/', jobPostController.getAllJobPosts);

// ✅ 공고 단건 조회
router.get('/:id', auth, jobPostController.getJobPostById);

// ✅ 공고 등록 (관리자만 가능 + 파일 업로드)
router.post('/', auth, isAdmin, upload.attachment.single('file'), jobPostController.createJobPost);

// ✅ 공고 수정 (관리자만 가능 + 파일 업로드)
router.put('/:id', auth, isAdmin, upload.attachment.single('file'), jobPostController.updateJobPost);

// ✅ 공고 삭제 (관리자만 가능)
router.delete('/:id', auth, isAdmin, jobPostController.deleteJobPost);

module.exports = router;