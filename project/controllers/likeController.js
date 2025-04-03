const Like = require('../models/Like');
const JobPost = require('../models/JobPost');

exports.toggleLike = async (req, res) => {
  const userId = req.user.id;
  const jobPostId = req.params.jobPostId;

  try {
    const existing = await Like.findOne({ where: { userId, jobPostId } });

    if (existing) {
      await existing.destroy();
      return res.json({ message: '좋아요 취소됨' });
    }

    await Like.create({ userId, jobPostId });
    res.json({ message: '좋아요 등록됨' });
  } catch (err) {
    console.error('좋아요 토글 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.getMyLikes = async (req, res) => {
  const userId = req.user.id;

  try {
    const likes = await Like.findAll({
      where: { userId },
      include: [{ model: JobPost }],
    });

    const likedPosts = likes.map(like => like.JobPost);

    res.json(likedPosts);
  } catch (err) {
    console.error('좋아요 목록 조회 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};