const JobPost = require('../models/JobPost');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

// ✅ D-day 계산 함수
function calculateDday(deadline) {
  const today = new Date();
  const deadlineDate = new Date(deadline);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'D-0 오늘마감';
  } else if (diffDays > 0) {
    return `D-${diffDays}`;
  } else {
    return `마감됨`;
  }
}

// ✅ 공고 전체 조회
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.findAll();

    const formatted = jobPosts.map(post => ({
      id: post.id,
      title: post.title,
      dDay: calculateDday(post.deadline),
      deadline: post.deadline,
      jobTitle: post.jobTitle,
      location: post.location,
      field: post.field,
      fileUrl: post.fileUrl,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('공고 전체 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 단건 조회
exports.getJobPostById = async (req, res) => {
  try {
    const post = await JobPost.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    const formatted = {
      id: post.id,
      title: post.title,
      dDay: calculateDday(post.deadline),
      deadline: post.deadline,
      jobTitle: post.jobTitle,
      location: post.location,
      field: post.field,
      fileUrl: post.fileUrl,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error('공고 단건 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 등록 (파일 + 관리자 토큰 기반)
exports.createJobPost = async (req, res) => {
  try {
    const { title, deadline, jobTitle, location, field } = req.body;
    const file = req.file;
    const userId = req.user.id; // 관리자 ID 자동 설정

    const jobPost = await JobPost.create({
      title,
      deadline,
      jobTitle,
      location,
      field,
      fileUrl: file ? file.location : null,
      postedBy: userId,
    });

    res.status(201).json({ message: '공고 등록 성공', jobPost });
  } catch (err) {
    console.error('공고 등록 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 공고 수정 (파일 + 관리자 토큰 기반)
exports.updateJobPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, deadline, jobTitle, location, field } = req.body;
    const file = req.file;

    const post = await JobPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    post.title = title;
    post.deadline = deadline;
    post.jobTitle = jobTitle;
    post.location = location;
    post.field = field;
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

// ✅ 공고 삭제
exports.deleteJobPost = async (req, res) => {
  try {
    const post = await JobPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '공고를 찾을 수 없습니다.' });
    }

    await post.destroy();
    res.status(200).json({ message: '공고 삭제 완료' });
  } catch (err) {
    console.error('공고 삭제 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};