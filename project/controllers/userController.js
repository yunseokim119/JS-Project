const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { joinMailOptions, resetPwOptions } = require('../module/email');
const nodemailer = require('nodemailer');

// 이메일 전송용 transporter 설정
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

// ✅ 1. 이메일 인증 기반 회원가입 요청 (인증코드 발송)
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
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 2. 인증코드 확인 후 비밀번호 설정 (회원가입 완료)
exports.confirmRegister = async (req, res) => {
  try {
    const { email, authCode, password } = req.body;

    const user = await User.findOne({
      where: { email, authCode, authState: false },
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

// ✅ 3. 로그인
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

    res.status(200).json({ message: '로그인 성공', accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 4. 비밀번호 변경 요청 (인증코드 발송)
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
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 5. 인증코드 확인 후 비밀번호 변경
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