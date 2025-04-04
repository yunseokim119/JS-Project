module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: '관리자만 접근할 수 있습니다.' });
    }
    next();
  };