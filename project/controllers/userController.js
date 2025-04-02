const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // DB에서 유저 조회
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 비밀번호 비교
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호 해시 및 업데이트
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err) {
    console.error('비밀번호 변경 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};


exports.deleteAccount = async (req, res) => {
    try {
      const userId = req.user.id; // JWT에서 유저 정보 추출됨
  
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  
      await user.destroy(); // DB에서 삭제
  
      res.status(200).json({ message: '회원 탈퇴 완료' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류 발생' });
    }
  };

  exports.logout = (req, res) => {
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  };