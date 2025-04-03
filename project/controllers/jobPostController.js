const JobPost = require('../models/JobPost');
const { deleteS3Object } = require('../module/s3module'); // ⬅️ s3 삭제 함수 import

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
    const { title, company, description, location, salary, postedBy } = req.body;
    const file = req.file;

    const jobPost = await JobPost.create({
      title,
      company,
      description,
      location,
      salary,
      postedBy,
      fileUrl: file ? file.location : null,
    });

    res.status(201).json({ message: '공고 등록 성공', jobPost });
  } catch (err) {
    console.error('공고 등록 오류:', err);
    console.log('요청 바디:', req.body);
    console.log('첨부 파일:', req.file);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 수정 + 이전 파일 삭제
exports.updateJobPost = async (req, res) => {
  const { id } = req.params;
  const { title, company, description, location, salary } = req.body;
  const file = req.file;

  try {
    const post = await JobPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    // 이전 파일이 있고 새 파일도 올라왔을 경우 기존 파일 삭제
    if (file && post.fileUrl) {
      const fileKey = post.fileUrl.split('.com/')[1];
      await deleteS3Object(fileKey);
    }

    post.title = title;
    post.company = company;
    post.description = description;
    post.location = location;
    post.salary = salary;
    if (file) {
      post.fileUrl = file.location;
    }

    await post.save();
    res.status(200).json({ message: '공고 수정 완료', jobPost: post });
  } catch (err) {
    console.error('공고 수정 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 삭제 + 파일도 삭제
exports.deleteJobPost = async (req, res) => {
  try {
    const post = await JobPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    // 파일이 등록되어 있으면 삭제
    if (post.fileUrl) {
      const fileKey = post.fileUrl.split('.com/')[1];
      await deleteS3Object(fileKey);
    }

    await post.destroy();
    res.status(200).json({ message: '공고가 삭제되었습니다.' });
  } catch (err) {
    console.error('공고 삭제 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};