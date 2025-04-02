const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

console.log('🧪 typeof changePassword:', typeof userController.changePassword);
console.log('🧪 typeof deleteAccount:', typeof userController.deleteAccount);
console.log('🧪 typeof logout:', typeof userController.logout);

router.put('/change-password', auth, userController.changePassword);
router.delete('/delete-account', auth, userController.deleteAccount);
router.post('/logout', auth, userController.logout);
router.put('/users/:id', userController.updateUser);

module.exports = router;