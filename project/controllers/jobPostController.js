const JobPost = require('../models/JobPost');

// ✅ 공고 전체 조회
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll();
    res.status(200).json(jobPosts);
  } catch (err) {
    console.error('공고 전체 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 단건 조회
exports.getJobPostById = async (req, res) => {
  try {
    const jobPost = await JobPost.findByPk(req.params.id);
    if (!jobPost) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }
    res.status(200).json(jobPost);
  } catch (err) {
    console.error('공고 단건 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 등록
exports.createJobPost = async (req, res) => {
    try {
      console.log('📥 받은 요청:', req.body);
      const jobPost = await JobPost.create(req.body);
      res.status(201).json({ jobPost });
    } catch (err) {
      console.error('공고 등록 오류:', err);
      res.status(500).json({ message: '서버 오류' });
    }
  };

// ✅ 공고 수정
exports.updateJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await JobPost.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    const { title, description, company, location, deadline } = req.body;
    await post.update({ title, description, company, location, deadline });

    res.status(200).json(post);
  } catch (err) {
    console.error('공고 수정 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 삭제
exports.deleteJobPost = async (req, res) => {
  try {
    const post = await JobPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    await post.destroy();
    res.status(200).json({ message: '공고가 삭제되었습니다.' });
  } catch (err) {
    console.error('공고 삭제 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};