const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

const {
  register,
  confirmRegister,
  login,
  checkAuthCode,
  deleteAccount
} = authController;

router.post('/register', register);                  
router.post('/register/confirm', confirmRegister);   
router.post('/login', login);
router.get('/check-auth-code', checkAuthCode);
router.delete('/', auth, deleteAccount);             

module.exports = router;