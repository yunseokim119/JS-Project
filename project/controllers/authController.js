const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { joinMailOptions } = require('../module/email');
console.log('✅ joinMailOptions type:', typeof joinMailOptions); // "function" 이어야 정상!
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.emailPw,
  },
});
console.log('✅ EMAIL_ACCOUNT:', process.env.EMAIL_ACCOUNT);
console.log('✅ emailPw:', process.env.emailPw);

// 이메일 인증 코드 전송
exports.register = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: '이메일을 입력해주세요.' });
      }
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
      }
  
      const authCode = Math.random().toString(36).substr(2, 6);
  
      await User.create({
        email,
        password: '0',         // 비밀번호는 나중에 설정
        authCode,
        authState: false,
        level: -1,
      });
  
      const mailOption = joinMailOptions(email, authCode);
      await transporter.sendMail(mailOption);
  
      res.status(200).json({ message: '인증코드를 이메일로 전송했습니다.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류' });
    }
  };

// 인증 코드 확인 및 비밀번호 설정
exports.confirmRegister = async (req, res) => {
  try {
    const { email, authCode, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
        authCode,
        authState: false,
      },
    });

    if (!user) {
      return res.status(400).json({ message: '잘못된 인증 코드입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.authCode = null;
    user.authState = true;
    user.level = 0;
    await user.save();

    res.status(200).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.authState) {
      return res.status(400).json({ message: '인증되지 않은 사용자입니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '로그인 성공', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// 인증코드 확인 (선택적 기능)
exports.checkAuthCode = async (req, res) => {
  try {
    const { email, authCode } = req.query;

    const user = await User.findOne({
      where: {
        email,
        authCode,
        authState: false,
      },
    });

    if (user) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};