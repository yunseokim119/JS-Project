const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { joinMailOptions } = require('../module/email');
const nodemailer = require('nodemailer');

console.log('📦 userController 로딩 시작됨');

let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.emailPw,
    },
  });
} catch (e) {
  console.error('❌ transporter 생성 실패:', e);
}

console.log('📦 userController 로딩 완료');

// ✅ 여기부터 exports 시작! 무조건 아래처럼!
exports.register = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
    }

    const authCode = Math.random().toString(36).substr(2, 6);

    await User.create({
      email,
      password: '0',
      authCode,
      authState: false,
      level: -1,
    });

    const mailOption = joinMailOptions(email, authCode);
    await transporter.sendMail(mailOption);

    res.status(200).json({ message: '인증코드를 이메일로 전송했습니다.' });
  } catch (err) {
    console.error('❌ register 함수 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

exports.updateUser = (req, res) => {
  res.send('사용자 업데이트 완료');
};

exports.changePassword = (req, res) => {
    res.send('비밀번호 변경');
  };
  
  exports.deleteAccount = (req, res) => {
    res.send('회원 탈퇴 완료');
  };
  
  exports.logout = (req, res) => {
    res.send('로그아웃 완료');
  };