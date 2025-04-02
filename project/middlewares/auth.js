const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    req.user = { id: user.id, email: user.email }; // 필요한 정보만 담기
    next();
  } catch (err) {
    console.error('JWT 인증 오류:', err);
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};