const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { resetPwOptions } = require('../module/email');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.emailPw,
  },
});

// 비밀번호 변경 요청 (이메일로 인증코드 발송)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.authState) {
      return res.status(404).json({ message: '존재하지 않거나 인증되지 않은 사용자입니다.' });
    }

    const authCode = Math.random().toString(36).substr(2, 6);
    user.authCode = authCode;
    await user.save();

    const mailOption = resetPwOptions(email, authCode);
    await transporter.sendMail(mailOption);

    res.status(200).json({ message: '인증코드를 이메일로 전송했습니다.' });
  } catch (err) {
    console.error('비밀번호 요청 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 비밀번호 변경 완료 (인증코드 검증 후 변경)
exports.confirmPasswordReset = async (req, res) => {
    const { email, authCode, newPassword, confirmPassword } = req.body;
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: '비밀번호가 서로 일치하지 않습니다.' });
    }
  
    try {
      const user = await User.findOne({ where: { email, authCode } });
  
      if (!user) {
        return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
      }
  
      if (user.loginType === 'kakao') {
        return res.status(403).json({ message: '카카오 로그인 유저는 비밀번호 변경이 불가능합니다.' });
      }
  
      const hashedPw = await bcrypt.hash(newPassword, 10);
      user.password = hashedPw;
      user.authCode = null;
      await user.save();
  
      res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류' });
    }
  };