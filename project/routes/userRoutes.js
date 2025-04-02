const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.put('/change-password', auth, userController.changePassword);
router.delete('/delete-account', auth, userController.deleteAccount);
router.post('/logout', auth, userController.logout);

module.exports = router;