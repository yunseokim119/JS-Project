const express = require('express');
const router = express.Router();
const upload = require('../module/upload');
const jobPostController = require('../controllers/jobPostController');
const auth = require('../middlewares/auth');

// 공고 전체 조회 (로그인 필요 없음)
router.get('/', jobPostController.getAllJobPosts);

// 공고 단건 조회
router.get('/:id', jobPostController.getJobPostById);

// 공고 등록 (관리자만 가능 + 파일 업로드)
router.post('/', auth, (req, res, next) => {
    console.log('🛬 [라우터] 공고 등록 요청 도착');
    next();
  }, upload.attachment.single('file'), (req, res, next) => {
    console.log('🧲 [multer] 파일 처리 후 실행됨');
    next();
  }, jobPostController.createJobPost);

// 공고 수정 (관리자만 가능)
router.put('/:id', auth, upload.attachment.single('file'), jobPostController.updateJobPost);

// 공고 삭제 (관리자만 가능)
router.delete('/:id', auth, jobPostController.deleteJobPost);

module.exports = router;