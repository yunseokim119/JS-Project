const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: '회원가입 성공!' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: '등록되지 않은 이메일입니다.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: '로그인 성공!', token });
};