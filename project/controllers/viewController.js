const View = require('../models/View');
const JobPost = require('../models/JobPost');
const { calculateDday } = require('../utils/ddayUtils');

// ✅ 내가 조회한 공고 목록 조회
exports.getMyViews = async (req, res) => {
  try {
    const views = await View.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']], // 🔥 조회 기록 최신순 정렬
      include: [{
        model: JobPost,
      }]
    });

    const formatted = views.map(view => ({
      id: view.JobPost.id,
      title: view.JobPost.title,
      dDay: calculateDday(view.JobPost.deadline),
      deadline: view.JobPost.deadline,
      jobTitle: view.JobPost.jobTitle,
      location: view.JobPost.location,
      field: view.JobPost.field,
      fileUrl: view.JobPost.fileUrl,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('조회한 공고 목록 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};