const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// router.put('/users/:id', userController.updateUser);
router.post('/change-password/request', userController.requestPasswordReset);
router.post('/change-password/confirm', userController.confirmPasswordReset);

module.exports = router;