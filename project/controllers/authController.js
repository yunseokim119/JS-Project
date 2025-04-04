const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const { joinMailOptions, resetPwOptions } = require('../module/email');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const qs = require('querystring');

// 이메일 전송용 transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.emailPw,
  },
});

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

// ✅ 2. 인증코드 확인 후 비밀번호 설정
exports.confirmRegister = async (req, res) => {
  try {
    const { email, authCode, password } = req.body;

    const user = await User.findOne({ where: { email, authCode, authState: false } });
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

// ✅ 4. 인증코드 유효성 확인
exports.checkAuthCode = async (req, res) => {
  try {
    const { email, authCode } = req.query;

    const user = await User.findOne({ where: { email, authCode, authState: false } });

    res.status(200).json({ valid: !!user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 5. 회원 탈퇴
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (err) {
    console.error('회원 탈퇴 오류:', err);
    res.status(500).json({ message: '서버 오류' });
  }
};

// ✅ 6. 카카오 로그인
exports.kakaoLogin = async (req, res) => {
  const { code } = req.body;

  try {
    // 1. access_token 발급
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 2. 사용자 정보 요청
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = userRes.data;
    const kakaoEmail = kakaoUser.kakao_account.email;

    if (!kakaoEmail) {
      return res.status(400).json({ message: '카카오 계정에 이메일이 없습니다.' });
    }

    // 3. 우리 DB에 존재 여부 확인 (없으면 자동 회원가입)
    let user = await User.findOne({ where: { email: kakaoEmail } });

    if (!user) {
      user = await User.create({
        email: kakaoEmail,
        password: 'kakao_login',
        authState: true,
        level: 0,
        loginType: 'kakao',
      });
    }

    // 4. 토큰 발급
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      message: '카카오 로그인 성공',
      accessToken: token,
      userId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error('카카오 로그인 오류:', err);
    return res.status(400).json({ message: '카카오 로그인 실패' });
  }
};

// ✅ 7. 관리자 권한 부여
exports.grantAdminRole = async (req, res) => {
  try {
    const requesterId = req.user.id; // 🔥 토큰에서 인증된 본인 ID
    const requester = await User.findByPk(requesterId);
    if (!requester) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // ✅ 현재 관리자 수 체크
    const adminCount = await User.count({ where: { role: 'admin' } });

    // ✅ 관리자 1명 이상 있을 때, 이미 관리자는 또 승격할 필요 없음
    if (adminCount > 0 && requester.role === 'admin') {
      return res.status(400).json({ message: '이미 관리자인 유저입니다.' });
    }

    // ✅ 관리자 권한 부여
    requester.role = 'admin';
    await requester.save();

    return res.status(200).json({
      message: '관리자 권한이 부여되었습니다.',
      user: requester
    });
  } catch (err) {
    console.error('관리자 권한 부여 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
};